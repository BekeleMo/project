package com.inventoryms.dto.request;

import com.inventoryms.enums.CustomerStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerCreateRequest {
    
    @NotBlank
    @Size(min = 2, max = 100)
    private String name;
    
    @Email
    @NotBlank
    private String email;
    
    private String phone;
    
    @Size(max = 500)
    private String address;
    
    @NotNull
    private CustomerStatus status;
    
    @Size(max = 1000)
    private String notes;
}