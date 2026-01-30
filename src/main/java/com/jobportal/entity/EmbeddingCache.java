package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "embeddings_cache")
public class EmbeddingCache {
    @Id
    private String id;

    @Indexed(unique = true)
    private String contentHash; // Hash of the text content

    private List<Double> vector;
    
    private String sourceId; // Optional: Job ID or Resume ID
    
    private LocalDateTime createdAt;
}
