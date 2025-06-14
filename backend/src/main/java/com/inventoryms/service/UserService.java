package com.inventoryms.service;

import com.inventoryms.dto.request.UserCreateRequest;
import com.inventoryms.dto.response.PageResponse;
import com.inventoryms.dto.response.UserResponse;
import com.inventoryms.entity.User;
import com.inventoryms.enums.UserStatus;
import org.springframework.data.domain.Pageable;

public interface UserService {
    
    PageResponse<UserResponse> getAllUsers(Pageable pageable);
    
    PageResponse<UserResponse> getUsersByFilters(String name, String email, UserStatus status, Pageable pageable);
    
    UserResponse getUserById(Long id);
    
    UserResponse createUser(UserCreateRequest request);
    
    UserResponse updateUser(Long id, UserCreateRequest request);
    
    void deleteUser(Long id);
    
    User getCurrentUser();
    
    UserResponse getCurrentUserResponse();
    
    void updateLastLogin(String email);
}