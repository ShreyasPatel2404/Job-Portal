package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
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

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {
	
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

	@Override
	public AuthResponse register(RegisterRequest request) {
		// Check if user already exists
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new RuntimeException("User already exists with email: " + request.getEmail());
		}
		
		// Create new user
		User user = new User();
		user.setName(request.getName());
		user.setEmail(request.getEmail().toLowerCase());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setAccountType(request.getAccountType());
		user.setIsActive(true);
		user.setIsEmailVerified(false);
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());
		
		user = userRepository.save(user);
		
		// Generate JWT token
		UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
		String token = jwtUtil.generateToken(userDetails, user.getId(), user.getAccountType());
		
		// Create UserDTO
		UserDTO userDTO = new UserDTO();
		userDTO.setId(user.getId());
		userDTO.setName(user.getName());
		userDTO.setEmail(user.getEmail());
		userDTO.setAccountType(user.getAccountType());
		
		return new AuthResponse(token, "Bearer", userDTO);
	}

	@Override
	public AuthResponse login(LoginRequest request) {
		// Authenticate user
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getEmail(),
						request.getPassword()
				)
		);
		
		// Load user details
		UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
		User user = userRepository.findByEmail(request.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		// Generate JWT token
		String token = jwtUtil.generateToken(userDetails, user.getId(), user.getAccountType());
		
		// Create UserDTO
		UserDTO userDTO = new UserDTO();
		userDTO.setId(user.getId());
		userDTO.setName(user.getName());
		userDTO.setEmail(user.getEmail());
		userDTO.setAccountType(user.getAccountType());
		
		return new AuthResponse(token, "Bearer", userDTO);
	}
}

