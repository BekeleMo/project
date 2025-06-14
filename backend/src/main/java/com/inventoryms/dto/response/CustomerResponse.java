package com.inventoryms.dto.response;

import com.inventoryms.enums.CustomerStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Integer totalOrders;
    private BigDecimal totalSpent;
    private CustomerStatus status;
    private LocalDateTime lastOrderDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}