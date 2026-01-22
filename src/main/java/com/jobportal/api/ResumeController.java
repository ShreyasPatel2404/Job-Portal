package com.jobportal.api;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal.entity.Resume;
import com.jobportal.entity.User;
import com.jobportal.exception.JobPortalException;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.ResumeService;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {
	
	private static final Logger log = LoggerFactory.getLogger(ResumeController.class);
	
	@Autowired
	private ResumeService resumeService;
	
	@Autowired
	private UserRepository userRepository;
	
	@Value("${app.upload.max-file-size:5242880}")
	private long maxFileSize;
	
	@Value("${app.upload.allowed-types}")
	private String allowedTypes;
	
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Resume> uploadResume(
			@RequestParam("file") MultipartFile file,
			@RequestParam(value = "isDefault", defaultValue = "true") Boolean isDefault,
			Authentication authentication) {
		
		User user = getCurrentUser(authentication);
		
		// Validate file is not empty
		if (file.isEmpty()) {
			log.warn("Empty file upload attempt by user: {}", user.getEmail());
			throw new JobPortalException("Please select a file to upload");
		}
		
		// Validate file size
		if (file.getSize() > maxFileSize) {
			log.warn("File size exceeded for user: {} - Size: {} bytes", user.getEmail(), file.getSize());
			throw new JobPortalException("File size must not exceed " + (maxFileSize / 1024 / 1024) + "MB");
		}
		
		// Validate file type
		String contentType = file.getContentType();
		List<String> allowedTypesList = Arrays.asList(allowedTypes.split(","));
		
		if (contentType == null || !allowedTypesList.contains(contentType)) {
			log.warn("Invalid file type upload attempt by user: {} - Type: {}", user.getEmail(), contentType);
			throw new JobPortalException("Only PDF, DOC, and DOCX files are allowed");
		}
		
		// Sanitize filename
		String originalFilename = file.getOriginalFilename();
		if (originalFilename == null || originalFilename.isEmpty()) {
			throw new JobPortalException("Invalid filename");
		}
		
		String cleanFilename = StringUtils.cleanPath(originalFilename);
		String fileExtension = cleanFilename.substring(cleanFilename.lastIndexOf("."));
		String newFilename = user.getId() + "_" + System.currentTimeMillis() + fileExtension;
		
		log.info("Resume upload initiated by user: {} - Filename: {}", user.getEmail(), cleanFilename);
		
		Resume uploaded = resumeService.uploadResume(file, newFilename, isDefault, user);
		return ResponseEntity.status(HttpStatus.CREATED).body(uploaded);
	}
	
	@GetMapping
	public ResponseEntity<List<Resume>> getMyResumes(Authentication authentication) {
		User user = getCurrentUser(authentication);
		List<Resume> resumes = resumeService.getResumesByUser(user);
		return ResponseEntity.ok(resumes);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Resume> getResumeById(
			@PathVariable String id,
			Authentication authentication) {
		User user = getCurrentUser(authentication);
		Resume resume = resumeService.getResumeById(id, user);
		return ResponseEntity.ok(resume);
	}
	
	@GetMapping("/default")
	public ResponseEntity<Resume> getDefaultResume(Authentication authentication) {
		User user = getCurrentUser(authentication);
		Resume resume = resumeService.getDefaultResume(user);
		return ResponseEntity.ok(resume);
	}
	
	@PutMapping("/{id}/default")
	public ResponseEntity<Resume> setAsDefault(
			@PathVariable String id,
			Authentication authentication) {
		User user = getCurrentUser(authentication);
		Resume resume = resumeService.setAsDefault(id, user);
		return ResponseEntity.ok(resume);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteResume(
			@PathVariable String id,
			Authentication authentication) {
		User user = getCurrentUser(authentication);
		resumeService.deleteResume(id, user);
		return ResponseEntity.noContent().build();
	}
	
	private User getCurrentUser(Authentication authentication) {
		String email = authentication.getName();
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));
	}
}
