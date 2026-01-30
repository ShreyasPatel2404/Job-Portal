package com.jobportal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmbeddingService {

    private final EmbeddingClient embeddingClient;

    public List<Double> generateEmbedding(String text) {
        try {
            long startTime = System.currentTimeMillis();
            List<Double> embedding = embeddingClient.embed(text);
            long duration = System.currentTimeMillis() - startTime;
            log.info("Generated embedding in {}ms for text length: {}", duration, text.length());
            return embedding;
        } catch (Exception e) {
            log.error("Error generating embedding: {}", e.getMessage());
            return null;
        }
    }
}
