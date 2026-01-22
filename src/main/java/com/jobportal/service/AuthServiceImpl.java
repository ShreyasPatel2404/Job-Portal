
package com.jobportal.service;

import com.jobportal.exception.JobPortalException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobportal.dto.AuthResponse;
import com.jobportal.dto.LoginRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.dto.UserDTO;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.utility.JwtUtil;
import com.jobportal.utility.EmailUtil;

import java.util.UUID;
import java.time.LocalDateTime;
import java.util.regex.Pattern;

@Service
public class AuthServiceImpl implements AuthService {
	
	private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
	
	private static final Pattern EMAIL_PATTERN = Pattern.compile(
		"^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
	);
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private EmailUtil emailUtil;
	
	@Value("${app.frontend.url}")
	private String frontendUrl;
	
	@Value("${app.email.verification.expiry:24}")
	private int verificationExpiryHours;
	
	@Value("${app.password.reset.expiry:1}")
	private int passwordResetExpiryHours;
	
	@Value("${app.security.password.min-length:8}")
	private int passwordMinLength;

	@Override
	public AuthResponse register(RegisterRequest request) {
		// Validate email format
		if (!isValidEmail(request.getEmail())) {
			log.warn("Registration attempt with invalid email format: {}", request.getEmail());
			throw new JobPortalException("Invalid email format");
		}
		
		// Validate password strength
		if (!isStrongPassword(request.getPassword())) {
			log.warn("Registration attempt with weak password for email: {}", request.getEmail());
			throw new JobPortalException(
				"Password must be at least " + passwordMinLength + 
				" characters with uppercase, lowercase, number, and special character"
			);
		}
		
		// Check if user already exists
		if (userRepository.findByEmail(request.getEmail().toLowerCase()).isPresent()) {
			log.warn("Registration attempt with existing email: {}", request.getEmail());
			throw new JobPortalException("User already exists with email: " + request.getEmail());
		}

		// Create new user
		User user = new User();
		user.setName(request.getName());
		user.setEmail(request.getEmail().toLowerCase());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setAccountType(request.getAccountType());
		user.setIsActive(true);
		// Auto-verify email for better UX in dev/demo environments or to reduce friction
		user.setIsEmailVerified(true);
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());

		// Generate email verification token with expiry
		String verificationToken = UUID.randomUUID().toString();
		user.setEmailVerificationToken(verificationToken);
		user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusHours(verificationExpiryHours));

		user = userRepository.save(user);
		
		log.info("User registered successfully: {} with accountType: {}", user.getEmail(), user.getAccountType());

		// Send verification email (Best effort, don't block registration)
		try {
			String verifyLink = frontendUrl + "/verify-email?token=" + verificationToken;
			String subject = "Verify your email address";
			String text = "Welcome to Job Portal! Please verify your email by clicking the link: " + verifyLink + 
						  "\n\nThis link will expire in " + verificationExpiryHours + " hours.";
			emailUtil.sendEmail(user.getEmail(), subject, text);
		} catch (Exception e) {
			log.error("Failed to send verification email to {}: {}", user.getEmail(), e.getMessage());
			// Proceed without failing the registration
		}

		// Generate JWT token for immediate login
		UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
		String token = jwtUtil.generateToken(userDetails, user.getId(), user.getAccountType());

		UserDTO userDTO = new UserDTO();
		userDTO.setId(user.getId());
		userDTO.setName(user.getName());
		userDTO.setEmail(user.getEmail());
		userDTO.setAccountType(user.getAccountType());

		return new AuthResponse(token, "Bearer", userDTO);
	}
	
	@Override
	public void sendVerificationEmail(String email) {
		User user = userRepository.findByEmail(email.toLowerCase())
			.orElseThrow(() -> {
				log.warn("Verification email requested for non-existent user: {}", email);
				return new JobPortalException("User not found");
			});
			
		if (user.getIsEmailVerified() != null && user.getIsEmailVerified()) {
			log.warn("Verification email requested for already verified user: {}", email);
			throw new JobPortalException("Email already verified");
		}
		
		String verificationToken = UUID.randomUUID().toString();
		user.setEmailVerificationToken(verificationToken);
		user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusHours(verificationExpiryHours));
		userRepository.save(user);
		
		log.info("Verification email sent to: {}", email);
		
		String verifyLink = frontendUrl + "/verify-email?token=" + verificationToken;
		String subject = "Verify your email address";
		String text = "Please verify your email by clicking the link: " + verifyLink +
					  "\n\nThis link will expire in " + verificationExpiryHours + " hours.";
		emailUtil.sendEmail(user.getEmail(), subject, text);
	}

	@Override
	public boolean verifyEmail(String token) {
		// Use indexed query instead of findAll()
		User user = userRepository.findByEmailVerificationToken(token)
			.orElseThrow(() -> {
				log.warn("Email verification attempted with invalid token");
				return new JobPortalException("Invalid verification token");
			});
		
		// Check expiration
		if (user.getEmailVerificationTokenExpiry() != null && 
			user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
			log.warn("Email verification attempted with expired token for user: {}", user.getEmail());
			throw new JobPortalException("Verification token has expired. Please request a new one.");
		}
		
		if (user.getIsEmailVerified()) {
			log.info("Email verification attempted for already verified user: {}", user.getEmail());
			throw new JobPortalException("Email already verified");
		}
		
		user.setIsEmailVerified(true);
		user.setEmailVerificationToken(null);
		user.setEmailVerificationTokenExpiry(null);
		userRepository.save(user);
		
		log.info("Email verified successfully for user: {}", user.getEmail());
		return true;
	}

	@Override
	public void sendPasswordResetEmail(String email) {
		User user = userRepository.findByEmail(email.toLowerCase())
			.orElseThrow(() -> {
				log.warn("Password reset requested for non-existent user: {}", email);
				return new JobPortalException("User not found");
			});
			
		String resetToken = UUID.randomUUID().toString();
		user.setResetPasswordToken(resetToken);
		user.setResetPasswordExpires(LocalDateTime.now().plusHours(passwordResetExpiryHours));
		userRepository.save(user);
		
		log.info("Password reset email sent to: {}", email);
		
		String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
		String subject = "Reset your password";
		String text = "To reset your password, click the link: " + resetLink +
					  "\n\nThis link will expire in " + passwordResetExpiryHours + " hour(s)." +
					  "\n\nIf you didn't request this, please ignore this email.";
		emailUtil.sendEmail(user.getEmail(), subject, text);
	}

	@Override
	public boolean resetPassword(String token, String newPassword) {
		// Use indexed query instead of findAll()
		User user = userRepository.findByResetPasswordToken(token)
			.orElseThrow(() -> {
				log.warn("Password reset attempted with invalid token");
				return new JobPortalException("Invalid or expired reset token");
			});
		
		// Check expiration
		if (user.getResetPasswordExpires() == null || 
			user.getResetPasswordExpires().isBefore(LocalDateTime.now())) {
			log.warn("Password reset attempted with expired token for user: {}", user.getEmail());
			throw new JobPortalException("Reset token has expired. Please request a new one.");
		}
		
		// Validate password strength
		if (!isStrongPassword(newPassword)) {
			log.warn("Password reset attempted with weak password for user: {}", user.getEmail());
			throw new JobPortalException(
				"Password must be at least " + passwordMinLength + 
				" characters with uppercase, lowercase, number, and special character"
			);
		}
		
		// Check if new password is same as old password
		if (passwordEncoder.matches(newPassword, user.getPassword())) {
			log.warn("Password reset attempted with same password for user: {}", user.getEmail());
			throw new JobPortalException("New password must be different from current password");
		}
		
		user.setPassword(passwordEncoder.encode(newPassword));
		user.setResetPasswordToken(null);
		user.setResetPasswordExpires(null);
		userRepository.save(user);
		
		log.info("Password reset successful for user: {}", user.getEmail());
		
		// Send confirmation email (Best effort)
		try {
			emailUtil.sendEmail(user.getEmail(), "Password Changed Successfully", 
				"Your password was successfully changed. If you didn't make this change, contact support immediately.");
		} catch (Exception e) {
			log.warn("Failed to send password change confirmation email to {}: {}", user.getEmail(), e.getMessage());
		}
		
		return true;
	}

	@Override
	public AuthResponse login(LoginRequest request) {
		String email = request.getEmail().toLowerCase();
		
		// Find user first
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> {
				log.warn("Login attempt with non-existent email: {}", email);
				return new JobPortalException("Invalid email or password");
			});
		
		// Check if account is active
		if (!user.getIsActive()) {
			log.warn("Login attempt for inactive account: {}", email);
			throw new JobPortalException("Account has been deactivated. Please contact support.");
		}
		
		// Check if email is verified
		if (!user.getIsEmailVerified()) {
			log.warn("Login attempt with unverified email: {}", email);
			throw new JobPortalException("Please verify your email before logging in");
		}
		
		try {
			authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
					email,
					request.getPassword()
				)
			);
		} catch (Exception ex) {
			log.warn("Failed login attempt for email: {}", email);
			throw new JobPortalException("Invalid email or password");
		}
		
		// Update last login timestamp
		user.setLastLoginAt(LocalDateTime.now());
		userRepository.save(user);
		
		log.info("User logged in successfully: {}", email);
		
		UserDetails userDetails = userDetailsService.loadUserByUsername(email);
		String token = jwtUtil.generateToken(userDetails, user.getId(), user.getAccountType());
		
		UserDTO userDTO = new UserDTO();
		userDTO.setId(user.getId());
		userDTO.setName(user.getName());
		userDTO.setEmail(user.getEmail());
		userDTO.setAccountType(user.getAccountType());
		
		return new AuthResponse(token, "Bearer", userDTO);
	}
	
	// Helper methods
	private boolean isValidEmail(String email) {
		return email != null && EMAIL_PATTERN.matcher(email).matches();
	}
	
	private boolean isStrongPassword(String password) {
		if (password == null || password.length() < passwordMinLength) {
			return false;
		}
		
		boolean hasUppercase = password.matches(".*[A-Z].*");
		boolean hasLowercase = password.matches(".*[a-z].*");
		boolean hasDigit = password.matches(".*\\d.*");
		boolean hasSpecial = password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*");
		
		return hasUppercase && hasLowercase && hasDigit && hasSpecial;
	}
}
