package com.jobportal.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.dto.UserDTO;
//import com.jobportal.exception.InvalidCredentialsException;
//import com.jobportal.exception.UserAlreadyExistsException;
import com.jobportal.service.UserService;

import jakarta.validation.Valid;


@RestController
@CrossOrigin
@Validated
@RequestMapping("/users")
public class UserAPI {
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<UserDTO> registerUser(@RequestBody @Valid UserDTO userDTO) {
		userDTO=userService.registerUser(userDTO);
        return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
	}
	
//	@PostMapping("/login")
//	public ResponseEntity<?> loginUser(@RequestParam String email, @RequestParam String password) {
//		try {
//			UserDTO user = userService.loginUser(email, password);
//			return ResponseEntity.ok(user);
//		} catch (InvalidCredentialsException e) {
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error logging in: " + e.getMessage());
//		}
//	}
}
