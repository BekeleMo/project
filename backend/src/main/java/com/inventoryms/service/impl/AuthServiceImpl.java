package com.inventoryms.service.impl;

import com.inventoryms.dto.request.LoginRequest;
import com.inventoryms.dto.response.AuthResponse;
import com.inventoryms.dto.response.UserResponse;
import com.inventoryms.entity.User;
import com.inventoryms.exception.InvalidCredentialsException;
import com.inventoryms.mapper.UserMapper;
import com.inventoryms.repository.UserRepository;
import com.inventoryms.security.JwtTokenProvider;
import com.inventoryms.service.AuthService;
import com.inventoryms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserService userService;
    
    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            User user = (User) authentication.getPrincipal();
            String token = jwtTokenProvider.generateToken(authentication);
            
            // Update last login
            userService.updateLastLogin(user.getEmail());
            
            UserResponse userResponse = userMapper.toResponse(user);
            return new AuthResponse(token, userResponse);
            
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }
    
    @Override
    public void logout() {
        // In a stateless JWT implementation, logout is typically handled on the client side
        // by removing the token. For additional security, you could implement token blacklisting
    }
}