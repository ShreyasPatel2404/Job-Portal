package com.jobportal.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobportal.entity.User;

public interface UserRepository extends MongoRepository<User, String> {
	Optional<User> findByEmail(String email);
	
	// Indexed queries for token lookups (replaces findAll().stream())
	Optional<User> findByEmailVerificationToken(String token);
	Optional<User> findByResetPasswordToken(String token);

	List<User> findByAccountType(AccountType accountType);

	@Query("{ accountType: 'APPLICANT', skills: { $in: ?0 }, isActive: true }")
	List<User> searchCandidatesBySkills(List<String> skills);
}
