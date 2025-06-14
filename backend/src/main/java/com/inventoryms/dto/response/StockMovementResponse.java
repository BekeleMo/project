package com.inventoryms.dto.response;

import com.inventoryms.enums.MovementType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StockMovementResponse {
    private Long id;
    private ProductResponse product;
    private MovementType type;
    private Integer quantity;
    private Integer previousStock;
    private Integer newStock;
    private String reason;
    private String location;
    private UserResponse createdBy;
    private String reference;
    private LocalDateTime createdAt;
}