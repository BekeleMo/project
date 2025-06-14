package com.inventoryms.dto.response;

import com.inventoryms.enums.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean read;
    private UserResponse user;
    private LocalDateTime createdAt;
}