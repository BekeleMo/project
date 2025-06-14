package com.inventoryms.dto.response;

import com.inventoryms.enums.UserRole;
import com.inventoryms.enums.UserStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private UserRole role;
    private UserStatus status;
    private Set<String> permissions;
    private LocalDateTime lastLogin;
    private String avatar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}