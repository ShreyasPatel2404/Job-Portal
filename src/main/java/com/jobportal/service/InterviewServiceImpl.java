package com.jobportal.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.entity.Interview;
import com.jobportal.entity.User;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.InterviewRepository;
import com.jobportal.repository.UserRepository;

@Service
public class InterviewServiceImpl implements InterviewService {
	
	@Autowired
	private InterviewRepository interviewRepository;
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public Interview scheduleInterview(Interview interview, String recruiterEmail, String candidateEmail) {
		User recruiter = userRepository.findByEmail(recruiterEmail)
				.orElseThrow(() -> new JobPortalException("Recruiter not found"));
		User candidate = userRepository.findByEmail(candidateEmail)
				.orElseThrow(() -> new JobPortalException("Candidate not found"));
		
		interview.setRecruiter(recruiter);
		interview.setCandidate(candidate);
		interview.setStatus("Scheduled");
		
		return interviewRepository.save(interview);
	}

	@Override
	public List<Interview> getInterviewsByRecruiter(User recruiter) {
		return interviewRepository.findByRecruiter(recruiter);
	}
	
	@Override
	public List<Interview> getInterviewsByCandidate(User candidate) {
		return interviewRepository.findByCandidate(candidate);
	}

	@Override
	public Interview updateStatus(String id, String status, User user) {
		Interview interview = interviewRepository.findById(id)
				.orElseThrow(() -> new JobPortalException("Interview not found"));
		
		// Verify ownership
		if (!interview.getRecruiter().getId().equals(user.getId()) && !interview.getCandidate().getId().equals(user.getId())) {
			throw new JobPortalException("Unauthorized access to interview");
		}
		
		interview.setStatus(status);
		return interviewRepository.save(interview);
	}

	@Override
	public void cancelInterview(String id, User user) {
		Interview interview = interviewRepository.findById(id)
				.orElseThrow(() -> new JobPortalException("Interview not found"));
		
		if (!interview.getRecruiter().getId().equals(user.getId())) {
			throw new JobPortalException("Only recruiter can delete/cancel interview");
		}
		
		interviewRepository.delete(interview);
	}
}
