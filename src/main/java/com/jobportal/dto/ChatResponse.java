package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private Intent intent;
    private String message;
    private List<?> data; // Jobs, questions, etc.
    private Map<String, Object> metadata;

    // Structured Advice Fields (Resume/Career)
    private String summaryFeedback;
    private List<String> missingSkills;
    private String formattingAdvice;
    private String roadmap;

}
