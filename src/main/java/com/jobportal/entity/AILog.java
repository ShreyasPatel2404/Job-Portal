package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_logs")
public class AILog {
    @Id
    private String id;
    private String userId;
    private String userRole;
    private String userQuery;
    private String aiIntent;
    private String aiResponse;
    private long responseTimeMs;
    private boolean success;
    private String errorMessage;
    private Long promptTokens;
    private Long completionTokens;
    private Long totalTokens;
    private LocalDateTime createdAt;
}
