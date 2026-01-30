package com.jobportal.config;

import com.jobportal.entity.ChatLog;
import com.jobportal.repository.ChatLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.MessageType;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MongoChatMemory implements ChatMemory {

    private final ChatLogRepository chatLogRepository;

    @Override
    public void add(String conversationId, Message message) {
        // We use userId as conversationId
        // The actual persistence is handled in ChatService.saveChatLog for now 
        // to maintain token usage and intent info.
        // However, this interface is required by Spring AI.
    }

    @Override
    public List<Message> get(String conversationId, int lastN) {
        List<ChatLog> logs = chatLogRepository.findByUserIdOrderByCreatedAtDesc(conversationId);
        
        return logs.stream()
                .limit(lastN)
                .flatMap(log -> {
                    List<Message> msgs = new ArrayList<>();
                    msgs.add(new UserMessage(log.getUserMessage()));
                    msgs.add(new AssistantMessage(log.getAiResponse()));
                    return msgs.stream();
                })
                .collect(Collectors.toList());
    }

    @Override
    public void clear(String conversationId) {
        // Optionally clear history
    }
}
