package com.inventoryms.entity;

import com.inventoryms.enums.CustomerStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer extends BaseEntity {
    
    @NotBlank
    @Size(min = 2, max = 100)
    @Column(nullable = false)
    private String name;
    
    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;
    
    private String phone;
    
    @Column(length = 500)
    private String address;
    
    @Column(name = "total_orders")
    private Integer totalOrders = 0;
    
    @Column(name = "total_spent", precision = 12, scale = 2)
    private BigDecimal totalSpent = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CustomerStatus status;
    
    @Column(name = "last_order_date")
    private LocalDateTime lastOrderDate;
    
    @Column(length = 1000)
    private String notes;
}