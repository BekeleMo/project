package com.inventoryms.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SaleItemResponse {
    private Long id;
    private ProductResponse product;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal total;
}