

		// (Removed misplaced method definition before package declaration)
package com.jobportal.api;

import java.time.LocalDateTime;
import java.util.List;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import com.jobportal.dto.ApplicationDTO;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.entity.Resume;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.ApplicationService;
import com.jobportal.service.ResumeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {
	
	private static final String UPLOAD_DIR = "uploads/resumes/";

		// Get applications for a job (for recruiter dashboard)
		@GetMapping("/job/{jobId}")
		public ResponseEntity<Page<ApplicationDTO>> getApplicationsByJob(
				@PathVariable String jobId,
				@RequestParam(defaultValue = "0") int page,
				@RequestParam(defaultValue = "10") int size,
				Authentication authentication) {
			User recruiter = getCurrentUser(authentication);
			Job job = jobRepository.findById(jobId)
					.orElseThrow(() -> new RuntimeException("Job not found"));
			// Only allow recruiter who posted the job
			if (!job.getPostedBy().getId().equals(recruiter.getId())) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
			}
			Pageable pageable = PageRequest.of(page, size);
			Page<ApplicationDTO> applications = applicationService.getApplicationsByJob(job, pageable);
			return ResponseEntity.ok(applications);
		}
	private static final Logger log = LoggerFactory.getLogger(ApplicationController.class);

	@Autowired
	private ApplicationService applicationService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JobRepository jobRepository;

	@Autowired
	private ResumeService resumeService;
// ...existing methods...
// (No duplicate class or misplaced imports)

	// Existing JSON-based application endpoint (keep for reference)
	@PostMapping("/job/{jobId}")
	public ResponseEntity<ApplicationDTO> applyToJob(
			@PathVariable String jobId,
			@Valid @RequestBody ApplicationDTO applicationDTO,
			Authentication authentication) {
		User applicant = getCurrentUser(authentication);
		
		// Map the applicant's default resume if none provided in DTO
		if (applicationDTO.getResumeUrl() == null || applicationDTO.getResumeUrl().isEmpty()) {
			try {
				Resume defaultResume = resumeService.getDefaultResume(applicant);
				applicationDTO.setResumeFileName(defaultResume.getFileName());
				
				String url = defaultResume.getFileUrl();
				if (url != null) {
					String filename = Paths.get(url).getFileName().toString();
					applicationDTO.setResumeUrl("/api/applications/download/" + filename);
				}
			} catch (Exception e) {
				// No default resume found
				throw new RuntimeException("No resume found. Please upload a resume in your profile before applying.");
			}
		}

		ApplicationDTO created = applicationService.applyToJob(jobId, applicationDTO, applicant);
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}

	// New: File upload endpoint for job application
	@PostMapping("/job/{jobId}/upload")
	public ResponseEntity<ApplicationDTO> applyToJobWithFile(
			@PathVariable String jobId,
			@RequestParam("resume") MultipartFile resumeFile,
			@RequestParam(value = "coverLetter", required = false) String coverLetter,
			Authentication authentication) throws IOException {
		User applicant = getCurrentUser(authentication);
		if (applicant == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		Job job = jobRepository.findById(jobId)
				.orElseThrow(() -> new RuntimeException("Job not found"));
		if (!"active".equals(job.getStatus())) {
			throw new RuntimeException("This job is no longer accepting applications");
		}
		if (job.getApplicationDeadline() != null && job.getApplicationDeadline().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Application deadline has passed");
		}
		// Save file to disk
		Path uploadPath = Paths.get(UPLOAD_DIR);
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath);
		}
		String resumeFileName = resumeFile.getOriginalFilename();
		String newFilename = System.currentTimeMillis() + "_" + resumeFileName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
		Path filePath = uploadPath.resolve(newFilename);
		Files.copy(resumeFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

		String resumeUrl = "/api/applications/download/" + newFilename;
		
		ApplicationDTO applicationDTO = new ApplicationDTO();
		applicationDTO.setResumeFileName(resumeFileName);
		applicationDTO.setResumeUrl(resumeUrl);
		applicationDTO.setCoverLetter(coverLetter);
		applicationDTO.setJobId(jobId);
		applicationDTO.setApplicantId(applicant.getId());
		ApplicationDTO created = applicationService.applyToJob(jobId, applicationDTO, applicant);
		created.setResumeUrl(resumeUrl); // Ensure resumeUrl is set in response
		return ResponseEntity.status(HttpStatus.CREATED).body(created);
	}
	
	// New: Endpoint to download resume
	@GetMapping("/download/{filename}")
	public ResponseEntity<Resource> downloadResume(@PathVariable String filename) {
		try {
			Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
			Resource resource = new UrlResource(filePath.toUri());

			if (resource.exists()) {
				return ResponseEntity.ok()
						.contentType(MediaType.parseMediaType("application/pdf"))
						.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
						.body(resource);
			} else {
				String errorMsg = "The requested resume file (" + filename + ") could not be found on the server. " +
								  "It may have been uploaded before the final file storage feature was implemented, or the file was deleted.";
				return ResponseEntity.status(HttpStatus.NOT_FOUND)
						.contentType(MediaType.TEXT_PLAIN)
						.body(new org.springframework.core.io.ByteArrayResource(errorMsg.getBytes()));
			}
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}
	}
	

	// New: Paginated endpoint to get all applications for the current user
	@GetMapping("")
	public ResponseEntity<Page<ApplicationDTO>> getApplications(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			Authentication authentication) {
		User applicant = getCurrentUser(authentication);
		Pageable pageable = PageRequest.of(page, size);
		Page<ApplicationDTO> applications = applicationService.getApplicationsByApplicant(applicant, pageable);
		return ResponseEntity.ok(applications);
	}

	@GetMapping("/status/{status}")
	public ResponseEntity<List<ApplicationDTO>> getApplicationsByStatus(
			@PathVariable String status,
			Authentication authentication) {
		User applicant = getCurrentUser(authentication);
		List<ApplicationDTO> applications = applicationService.getApplicationsByStatus(applicant, status);
		return ResponseEntity.ok(applications);
	}
	
	@PutMapping("/{id}/status")
	public ResponseEntity<ApplicationDTO> updateStatus(
			@PathVariable String id,
			@RequestParam String status,
			@RequestParam(required = false) String notes,
			@RequestParam(required = false) String rejectionReason,
			Authentication authentication) {
		User recruiter = getCurrentUser(authentication);
		ApplicationDTO updated = applicationService.updateApplicationStatus(id, status, recruiter, notes, rejectionReason);
		return ResponseEntity.ok(updated);
	}
	
	private User getCurrentUser(Authentication authentication) {

		String email = authentication.getName();
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found"));
	}
}

