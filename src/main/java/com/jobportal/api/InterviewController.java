package com.jobportal.api;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.entity.Interview;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.InterviewService;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "*")
public class InterviewController {

	@Autowired
	private InterviewService interviewService;
	
	@Autowired
	private UserRepository userRepository;
	
	@PostMapping
	public ResponseEntity<Interview> scheduleInterview(
			@RequestBody Map<String, Object> payload,
			Authentication authentication) {
		
		User recruiter = getCurrentUser(authentication);
		String candidateEmail = (String) payload.get("candidateEmail");
		String jobTitle = (String) payload.get("jobTitle");
		String type = (String) payload.get("type");
		String dateTimeStr = (String) payload.get("scheduledTime");
		
		Interview interview = new Interview();
		interview.setJobTitle(jobTitle);
		interview.setType(type);
		interview.setScheduledTime(LocalDateTime.parse(dateTimeStr)); // Expect ISO 8601 format
		
		Interview saved = interviewService.scheduleInterview(interview, recruiter.getEmail(), candidateEmail);
		return ResponseEntity.ok(saved);
	}
	
	@GetMapping("/my-interviews")
	public ResponseEntity<List<Interview>> getMyInterviews(Authentication authentication) {
		User user = getCurrentUser(authentication);
		// Simple role check based on entity
		if ("EMPLOYER".equalsIgnoreCase(user.getAccountType().name())) {
			return ResponseEntity.ok(interviewService.getInterviewsByRecruiter(user));
		} else {
			return ResponseEntity.ok(interviewService.getInterviewsByCandidate(user));
		}
	}
	
	@PutMapping("/{id}/status")
	public ResponseEntity<Interview> updateStatus(
			@PathVariable String id,
			@RequestParam String status,
			Authentication authentication) {
		User user = getCurrentUser(authentication);
		Interview updated = interviewService.updateStatus(id, status, user);
		return ResponseEntity.ok(updated);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> cancelInterview(
			@PathVariable String id,
			Authentication authentication) {
		User user = getCurrentUser(authentication);
		interviewService.cancelInterview(id, user);
		return ResponseEntity.noContent().build();
	}
	
	private User getCurrentUser(Authentication authentication) {
		String email = authentication.getName();
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));
	}
}
