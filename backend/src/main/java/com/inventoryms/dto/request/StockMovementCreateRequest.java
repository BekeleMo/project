package com.inventoryms.dto.request;

import com.inventoryms.enums.MovementType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StockMovementCreateRequest {
    
    @NotNull
    private Long productId;
    
    @NotNull
    private MovementType type;
    
    @Min(1)
    private Integer quantity;
    
    @NotBlank
    private String reason;
    
    @NotBlank
    private String location;
    
    private String reference;
}