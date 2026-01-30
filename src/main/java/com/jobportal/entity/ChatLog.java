package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_logs")
public class ChatLog {
    @Id
    private String id;

    @Indexed
    private String userId;

    private String userMessage;
    private String aiResponse;
    private String intent;
    
    private Map<String, Object> metadata;

    private Long promptTokens;
    private Long completionTokens;
    private Long totalTokens;

    @CreatedDate
    private LocalDateTime createdAt;
}
