package com.inventoryms.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SaleCreateRequest {
    
    @NotNull
    private Long customerId;
    
    @NotEmpty
    @Valid
    private List<SaleItemRequest> items;
    
    private String paymentMethod;
    
    private String notes;
}