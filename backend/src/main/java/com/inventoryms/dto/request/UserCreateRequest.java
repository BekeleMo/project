package com.inventoryms.dto.request;

import com.inventoryms.enums.UserRole;
import com.inventoryms.enums.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UserCreateRequest {
    
    @NotBlank
    @Size(min = 2, max = 100)
    private String name;
    
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    @Size(min = 8)
    private String password;
    
    @NotNull
    private UserRole role;
    
    @NotNull
    private UserStatus status;
    
    private Set<String> permissions;
    
    private String avatar;
}