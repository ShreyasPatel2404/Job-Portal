package com.jobportal.dto;

import com.jobportal.entity.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
	private String id;
	@NotBlank(message = "{user.name.absent}")
	private String name;
	@NotBlank(message = "{user.email.absent}")
	@Email(message = "{user.email.invalid}")
	private String email;
	@NotBlank(message = "{user.password.absent}")
	@Password(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_=+-]).{8,15}$", message = "{user.password.invalid}")
	private String password;
	private AccountType accountType;
	public User toEntity(){
		return new User(this.id, this.name, this.email, this.password, this.accountType);
	}
}
