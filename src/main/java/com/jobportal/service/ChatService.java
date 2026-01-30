package com.jobportal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.annotation.MonitoredAI;
import com.jobportal.dto.ChatResponse;
import com.jobportal.dto.Intent;
import com.jobportal.entity.*;
import com.jobportal.repository.*;
import com.jobportal.util.CosineSimilarityUtil;
import com.jobportal.util.JSONValidatorUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient chatClient;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final ChatLogRepository chatLogRepository;
    private final EmbeddingService embeddingService;
    private final ChatMemory chatMemory;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    
    private final JobTrendService jobTrendService;
    private final SalaryInsightService salaryInsightService;
    private final FallbackService fallbackService;
    private final PromptBuilderService promptBuilderService;
    private final ApplicationHelpService applicationHelpService;

    @MonitoredAI
    public ChatResponse processChat(String message, User user) {
        log.info("Processing chat for user: {} ({})", user.getEmail(), user.getAccountType());

        try {
            List<Message> history = chatMemory.get(user.getId(), 5);
            String historyStr = history.isEmpty() ? "None" : history.stream()
                .map(m -> m.getMessageType().name() + ": " + m.getContent()).toList().toString();

            String systemPrompt = promptBuilderService.buildSystemPrompt(user.getAccountType().name(), historyStr);
            String context = fetchUserContext(message, user);

            Prompt prompt = new Prompt(
                    List.of(
                            new UserMessage(systemPrompt),
                            new UserMessage(context + "\nUser Message: " + message)
                    ),
                    OllamaOptions.create().withTemperature(0.2f).withModel("llama3")
            );

            org.springframework.ai.chat.ChatResponse aiResponse = chatClient.call(prompt);
            String aiText = aiResponse.getResult().getOutput().getContent();

            if (!JSONValidatorUtil.isValidResponse(aiText)) {
                return fallbackService.handleFallback(message);
            }

            ChatResponse response = parseAiResponse(aiText);
            routeIntent(response, user, message);

            return response;

        } catch (Exception e) {
            log.error("Chat processing failed: {}", e.getMessage());
            return fallbackService.handleFallback(message);
        }
    }

    private String fetchUserContext(String message, User user) {
        StringBuilder context = new StringBuilder();
        if (message.toUpperCase().contains("RESUME") || message.toUpperCase().contains("MATCH")) {
            resumeRepository.findByUserIdAndIsDefaultTrue(user)
                .ifPresent(r -> context.append("User Resume: ").append(r.getParsedData() != null ? r.getParsedData().toString() : "File: " + r.getFileName()).append("\n"));
        }
        if (message.toUpperCase().contains("APPLICATIONS") || message.toUpperCase().contains("STATUS")) {
            List<Application> apps = applicationRepository.findByApplicantId(user);
            context.append("Job Applications: ").append(apps.stream().map(a -> a.getJobId().getTitle() + " (" + a.getStatus() + ")").toList()).append("\n");
        }
        return context.toString();
    }

    private ChatResponse parseAiResponse(String aiText) throws Exception {
        JsonNode rootNode = objectMapper.readTree(aiText);
        Intent intent = Intent.valueOf(rootNode.path("intent").asText("GENERAL_CHAT"));
        
        ChatResponse response = ChatResponse.builder()
                .intent(intent)
                .message(rootNode.path("message").asText())
                .build();

        Map<String, Object> metadata = new HashMap<>();
        if (rootNode.has("filters")) metadata.put("filters", rootNode.get("filters"));
        if (rootNode.has("jobId")) metadata.put("jobId", rootNode.path("jobId").asText());
        if (rootNode.has("skill")) metadata.put("skill", rootNode.path("skill").asText());
        if (rootNode.has("location")) metadata.put("location", rootNode.path("location").asText());
        
        response.setMetadata(metadata);
        
        if (rootNode.has("questions")) response.setData(objectMapper.convertValue(rootNode.get("questions"), List.class));
        if (rootNode.has("skills")) response.setData(objectMapper.convertValue(rootNode.get("skills"), List.class));

        return response;
    }

    private void routeIntent(ChatResponse response, User user, String originalQuery) {
        log.info("Routing intent: {}", response.getIntent());
        switch (response.getIntent()) {
            case JOB_SEARCH -> handleJobSearch(response);
            case RESUME_JOB_MATCH -> handleResumeJobMatch(response, user);
            case CANDIDATE_SEARCH -> handleCandidateSearch(response);
            case JOB_TREND_ANALYSIS -> handleJobTrend(response);
            case SALARY_INSIGHT -> handleSalaryInsight(response);
            case APPLICATION_HELP -> handleApplicationHelp(response, user);
            default -> {}
        }
    }

    private void handleJobSearch(ChatResponse response) {
        JsonNode filters = (JsonNode) response.getMetadata().get("filters");
        if (filters == null || filters.isEmpty()) {
            response.setData(jobRepository.findByStatusOrderByCreatedAtDesc("active"));
            return;
        }

        String location = filters.path("location").asText(null);
        String jobType = filters.path("jobType").asText(null);
        
        if (location != null && jobType != null) {
            response.setData(jobRepository.findByFilters("active", location, jobType));
        } else if (location != null) {
            response.setData(jobRepository.findByLocation(location));
        } else if (jobType != null) {
            response.setData(jobRepository.findByJobType(jobType));
        } else {
            response.setData(jobRepository.findByStatusOrderByCreatedAtDesc("active"));
        }
    }

    private void handleResumeJobMatch(ChatResponse response, User user) {
        String jobId = (String) response.getMetadata().get("jobId");
        Optional<Job> jobOpt = jobRepository.findById(jobId != null ? jobId : "");
        Optional<Resume> resumeOpt = resumeRepository.findByUserIdAndIsDefaultTrue(user);

        if (jobOpt.isPresent() && resumeOpt.isPresent()) {
            List<Double> jV = embeddingService.getEmbedding(jobOpt.get().getDescription());
            List<Double> rV = embeddingService.getEmbedding(resumeOpt.get().getParsedData().toString());
            double sim = CosineSimilarityUtil.calculate(jV, rV);
            
            Map<String, Object> match = new HashMap<>();
            match.put("matchScore", (int)(sim * 100));
            match.put("jobTitle", jobOpt.get().getTitle());
            response.setData(List.of(match));
        }
    }

    private void handleCandidateSearch(ChatResponse response) {
        response.setData(userRepository.findByAccountType(com.jobportal.dto.AccountType.APPLICANT));
    }

    private void handleJobTrend(ChatResponse response) {
        List<String> trends = jobTrendService.getTrendingSkills(10);
        Map<String, Object> data = new HashMap<>();
        data.put("trends", trends);
        response.setData(List.of(data));
        response.setMessage(response.getMessage() + "\nReal-time Data: " + String.join(", ", trends));
    }

    private void handleSalaryInsight(ChatResponse response) {
        String skill = (String) response.getMetadata().get("skill");
        String location = (String) response.getMetadata().get("location");
        Map<String, Object> insights = salaryInsightService.getSalaryInsight(skill, location);
        response.setData(List.of(insights));
        response.setMessage(response.getMessage() + String.format("\nAnalysis: Average range based on %s samples.", insights.get("sampleSize")));
    }

    private void handleApplicationHelp(ChatResponse response, User user) {
        Optional<Resume> resumeOpt = resumeRepository.findByUserIdAndIsDefaultTrue(user);
        Map<String, Object> intel = applicationHelpService.getApplicationIntelligence(user.getId(), resumeOpt.orElse(null));
        response.setData(List.of(intel));
    }
}
