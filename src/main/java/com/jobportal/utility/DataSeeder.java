package com.jobportal.utility;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.dto.AccountType;
import com.jobportal.entity.Application;
import com.jobportal.entity.Company;
import com.jobportal.entity.CompanyReview;
import com.jobportal.entity.Job;
import com.jobportal.entity.Notification;
import com.jobportal.entity.Resume;
import com.jobportal.entity.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.CompanyReviewRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.NotificationRepository;
import com.jobportal.repository.ResumeRepository;
import com.jobportal.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class DataSeeder implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JobRepository jobRepository;

	@Autowired
	private ApplicationRepository applicationRepository;

	@Autowired
	private NotificationRepository notificationRepository;

	@Autowired
	private CompanyReviewRepository companyReviewRepository;
	
	@Autowired
	private CompanyRepository companyRepository;

	@Autowired
	private ResumeRepository resumeRepository;
	
    @Autowired
    private PasswordEncoder passwordEncoder;

	@Autowired
	private ObjectMapper objectMapper;

	@Override
	public void run(String... args) throws Exception {
		loadUserData();
	}

	private void loadUserData() {
		if (userRepository.count() > 0) {
			log.info("Database already seeded. Skipping data seeding.");
			return;
		}

		try {
			InputStream is;
			File file = new File("src/main/resources/full-sample-data.json");
			if (file.exists()) {
				is = new java.io.FileInputStream(file);
			} else {
				// Fallback to classpath
				is = new ClassPathResource("full-sample-data.json").getInputStream();
			}
			JsonNode rootNode = objectMapper.readTree(is);

			Map<String, User> userMap = new HashMap<>(); 
			Map<String, Job> jobMap = new HashMap<>(); 
			Map<String, Company> companyMap = new HashMap<>(); 

			// 1. Seed Users, Companies, Resumes
			JsonNode usersNode = rootNode.get("users");
			if (usersNode != null) {
				for (JsonNode node : usersNode) {
					User user = new User();
					user.setName(node.get("fullName").asText());
					user.setEmail(node.get("email").asText());
					user.setPassword(passwordEncoder.encode(node.get("password").asText()));
					user.setAccountType(AccountType.valueOf(node.get("role").asText()));
					user.setIsEmailVerified(node.has("verified") ? node.get("verified").asBoolean() : true);
					user.setCreatedAt(LocalDateTime.now());
					if (node.has("bio")) user.setBio(node.get("bio").asText());
					if (node.has("skills")) user.setSkills(objectMapper.convertValue(node.get("skills"), new TypeReference<List<String>>() {}));
					
					User savedUser = userRepository.save(user);
					userMap.put(savedUser.getEmail(), savedUser);
					
					// Handle Company (Employer)
					if (node.has("company")) {
						JsonNode compNode = node.get("company");
						Company company = new Company();
						company.setRecruiterId(savedUser);
						company.setCompanyName(compNode.get("name").asText());
						company.setDescription(compNode.get("description").asText());
						if (compNode.has("website")) company.setWebsite(compNode.get("website").asText());
						if (compNode.has("location")) company.setLocation(compNode.get("location").asText());
						if (compNode.has("industry")) company.setIndustry(compNode.get("industry").asText());
						if (compNode.has("size")) company.setCompanySize(compNode.get("size").asText());
						company.setCreatedAt(LocalDateTime.now());
						
						Company savedComp = companyRepository.save(company);
						companyMap.put(savedComp.getCompanyName(), savedComp);
					}

					// Handle Resume (Applicant)
					if (node.has("resume")) {
						JsonNode resNode = node.get("resume");
						Resume resume = new Resume();
						resume.setUserId(savedUser);
						resume.setFileName(resNode.get("fileName").asText());
						resume.setFileUrl(resNode.get("url").asText());
						if (resNode.has("size")) resume.setFileSize(resNode.get("size").asLong());
						if (resNode.has("type")) resume.setFileType(resNode.get("type").asText());
						resume.setUploadedAt(LocalDateTime.now());
						
						resumeRepository.save(resume);
					}
				}
				log.info("Seeded {} users", userMap.size());
			}

			// 2. Seed Jobs
			JsonNode jobsNode = rootNode.get("jobs");
			if (jobsNode != null) {
				for (JsonNode node : jobsNode) {
					Job job = new Job();
					job.setTitle(node.get("title").asText());
					job.setDescription(node.get("description").asText());
					job.setCompany(node.get("company").asText());
					job.setLocation(node.get("location").asText());
					job.setJobType(node.get("type").asText());
					job.setRequirements(objectMapper.convertValue(node.get("requirements"), new TypeReference<List<String>>() {}));
					if (node.has("skills")) job.setSkills(objectMapper.convertValue(node.get("skills"), new TypeReference<List<String>>() {}));
					if (node.has("salary")) job.setSalaryMin(node.get("salary").asDouble());
					if (node.has("category")) job.setCategory(node.get("category").asText());
					if (node.has("experienceLevel")) job.setExperienceLevel(node.get("experienceLevel").asText());
					
					String postedByEmail = node.get("postedBy").asText();
					if (userMap.containsKey(postedByEmail)) {
						job.setPostedBy(userMap.get(postedByEmail));
					}
					
					job.setStatus(node.get("status").asText().toLowerCase());
					job.setCreatedAt(LocalDateTime.now());
					
					Job savedJob = jobRepository.save(job);
					jobMap.put(savedJob.getTitle(), savedJob);
				}
				log.info("Seeded {} jobs", jobMap.size());
			}

			// 3. Seed Applications
			JsonNode appsNode = rootNode.get("applications");
			if (appsNode != null) {
				for (JsonNode node : appsNode) {
					String jobTitle = node.get("jobTitle").asText();
					String applicantEmail = node.get("applicant").asText();

					if (jobMap.containsKey(jobTitle) && userMap.containsKey(applicantEmail)) {
						try {
							Application app = new Application();
							app.setJobId(jobMap.get(jobTitle));
							app.setApplicantId(userMap.get(applicantEmail));
							app.setStatus(node.get("status").asText().toLowerCase());
							app.setResumeUrl(node.get("resume").asText());
							if (node.has("coverLetter")) app.setCoverLetter(node.get("coverLetter").asText());
							if (node.has("rejectionReason")) app.setRejectionReason(node.get("rejectionReason").asText());
							app.setAppliedAt(LocalDateTime.now());
							
							applicationRepository.save(app);
						} catch (Exception e) {
							log.warn("Skipping application seeding for {} on {}: {}", applicantEmail, jobTitle, e.getMessage());
						}
					}
				}
				log.info("Seeded applications");
			}

			// 4. Seed Notifications
			JsonNode notifsNode = rootNode.get("notifications");
			if (notifsNode != null) {
				for (JsonNode node : notifsNode) {
					String recipientEmail = node.get("recipient").asText();
					if (userMap.containsKey(recipientEmail)) {
						Notification notif = new Notification();
						notif.setUserId(userMap.get(recipientEmail)); 
						notif.setMessage(node.get("message").asText());
						notif.setRead(node.get("read").asBoolean());
						notif.setCreatedAt(LocalDateTime.now());
						notif.setTitle(node.has("type") ? node.get("type").asText() : "Notification");
						notif.setType(node.has("type") ? node.get("type").asText() : "system");
						
						notificationRepository.save(notif);
					}
				}
				log.info("Seeded notifications");
			}

			// 5. Seed Company Reviews
			JsonNode reviewsNode = rootNode.get("companyReviews");
			if (reviewsNode != null) {
				for (JsonNode node : reviewsNode) {
					CompanyReview review = new CompanyReview();
					
					String companyName = node.get("company").asText();
					if (companyMap.containsKey(companyName)) {
						review.setCompanyId(companyMap.get(companyName).getId());
					} else {
						// Fallback or skip
						review.setCompanyId(companyName); // Or generate a dummy ID
					}
					
					review.setTitle(node.get("title").asText());
					review.setComment(node.get("comment").asText());
					review.setRating(node.get("rating").asInt());
					review.setCreatedAt(new java.util.Date());
					
					String authorEmail = node.get("author").asText();
					if(userMap.containsKey(authorEmail)) {
						User author = userMap.get(authorEmail);
						review.setAuthorId(author.getId());
						review.setAuthorName(author.getName());
					} else {
						review.setAuthorName("Anonymous");
					}
					
					companyReviewRepository.save(review);
				}
				log.info("Seeded reviews");
			}

		} catch (IOException e) {
			log.error("Failed to seed data", e);
		}
	}
}
