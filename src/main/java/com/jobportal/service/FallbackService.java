package com.jobportal.service;

import com.jobportal.dto.ChatResponse;
import com.jobportal.dto.Intent;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class FallbackService {

    private final JobRepository jobRepository;

    public ChatResponse handleFallback(String query) {
        log.warn("Triggering fallback keyword search for: {}", query);
        
        // Simple heuristic: extract lookalikes for locations or skills
        String location = extractLocation(query);
        
        ChatResponse response = ChatResponse.builder()
                .intent(Intent.JOB_SEARCH)
                .message("I'm having a bit of trouble with my advanced logic, but I found these jobs that might interest you:")
                .build();

        if (location != null) {
            response.setData(jobRepository.findByLocation(location));
        } else {
            response.setData(jobRepository.findByStatusOrderByCreatedAtDesc("active"));
        }
        
        return response;
    }

    private String extractLocation(String text) {
        // Very basic regex for common cities or "in [Location]"
        Pattern pattern = Pattern.compile("(?i)in\\s+([a-z\\s]+)");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }
}
