package com.inventoryms.dto.response;

import com.inventoryms.enums.SaleStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SaleResponse {
    private Long id;
    private CustomerResponse customer;
    private List<SaleItemResponse> items;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal total;
    private SaleStatus status;
    private LocalDateTime saleDate;
    private String paymentMethod;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}