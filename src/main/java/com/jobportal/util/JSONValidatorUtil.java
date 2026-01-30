package com.jobportal.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JSONValidatorUtil {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static boolean isValidResponse(String json) {
        try {
            JsonNode root = objectMapper.readTree(json);
            return root.has("intent") && root.has("message");
        } catch (Exception e) {
            log.error("JSON Validation failed: {}", e.getMessage());
            return false;
        }
    }
}
