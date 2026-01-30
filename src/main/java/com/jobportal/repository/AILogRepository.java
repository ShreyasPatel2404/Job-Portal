package com.jobportal.repository;

import com.jobportal.entity.AILog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AILogRepository extends MongoRepository<AILog, String> {
}
