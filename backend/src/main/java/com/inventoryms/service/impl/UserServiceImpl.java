package com.inventoryms.service.impl;

import com.inventoryms.dto.request.UserCreateRequest;
import com.inventoryms.dto.response.PageResponse;
import com.inventoryms.dto.response.UserResponse;
import com.inventoryms.entity.User;
import com.inventoryms.enums.UserStatus;
import com.inventoryms.exception.ResourceNotFoundException;
import com.inventoryms.exception.DuplicateResourceException;
import com.inventoryms.mapper.UserMapper;
import com.inventoryms.repository.UserRepository;
import com.inventoryms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        Page<UserResponse> userResponses = users.map(userMapper::toResponse);
        return new PageResponse<>(userResponses);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getUsersByFilters(String name, String email, UserStatus status, Pageable pageable) {
        Page<User> users = userRepository.findByFilters(name, email, status, pageable);
        Page<UserResponse> userResponses = users.map(userMapper::toResponse);
        return new PageResponse<>(userResponses);
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }
    
    @Override
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User already exists with email: " + request.getEmail());
        }
        
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        User savedUser = userRepository.save(user);
        return userMapper.toResponse(savedUser);
    }
    
    @Override
    public UserResponse updateUser(Long id, UserCreateRequest request) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        if (!existingUser.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User already exists with email: " + request.getEmail());
        }
        
        userMapper.updateEntity(request, existingUser);
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        User savedUser = userRepository.save(existingUser);
        return userMapper.toResponse(savedUser);
    }
    
    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUserResponse() {
        User currentUser = getCurrentUser();
        return userMapper.toResponse(currentUser);
    }
    
    @Override
    public void updateLastLogin(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }
}