package com.inventoryms.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SaleItemRequest {
    
    @NotNull
    private Long productId;
    
    @Min(1)
    private Integer quantity;
    
    @DecimalMin("0.0")
    @Digits(integer = 10, fraction = 2)
    private BigDecimal price;
}