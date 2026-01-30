package com.jobportal.repository;

import com.jobportal.entity.EmbeddingCache;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmbeddingCacheRepository extends MongoRepository<EmbeddingCache, String> {
    Optional<EmbeddingCache> findByContentHash(String contentHash);
}
