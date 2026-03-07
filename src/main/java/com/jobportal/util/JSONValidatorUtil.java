package com.jobportal.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JSONValidatorUtil {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static boolean isValidResponse(String json) {
        try {
            String extracted = extractJson(json);
            JsonNode root = objectMapper.readTree(extracted);
            return root.has("intent") && root.has("message");
        } catch (Exception e) {
            log.error("JSON Validation failed: {}", e.getMessage());
            return false;
        }
    }

    public static String extractJson(String text) {
        if (text == null) return "{}";
        
        // Try to find the first '{' and the last '}'
        int firstBrace = text.indexOf('{');
        int lastBrace = text.lastIndexOf('}');
        
        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            return text.substring(firstBrace, lastBrace + 1);
        }
        
        // Look for markdown fences as fallback
        if (text.contains("```json")) {
            int start = text.indexOf("```json") + 7;
            int end = text.indexOf("```", start);
            if (end != -1) return text.substring(start, end).trim();
        }
        
        return text.trim();
    }
}
