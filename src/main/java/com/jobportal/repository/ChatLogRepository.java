package com.jobportal.repository;

import com.jobportal.entity.ChatLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatLogRepository extends MongoRepository<ChatLog, String> {
    List<ChatLog> findByUserIdOrderByCreatedAtDesc(String userId);
}
