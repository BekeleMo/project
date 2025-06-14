package com.inventoryms.service;

import com.inventoryms.dto.request.LoginRequest;
import com.inventoryms.dto.response.AuthResponse;

public interface AuthService {
    
    AuthResponse login(LoginRequest request);
    
    void logout();
}