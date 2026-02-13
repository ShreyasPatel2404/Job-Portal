package com.jobportal.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.entity.Interview;
import com.jobportal.entity.User;

public interface InterviewRepository extends MongoRepository<Interview, String> {
	
	List<Interview> findByRecruiter(User recruiter);
	List<Interview> findByCandidate(User candidate);
	List<Interview> findByScheduledTimeBetween(LocalDateTime start, LocalDateTime end);
}
