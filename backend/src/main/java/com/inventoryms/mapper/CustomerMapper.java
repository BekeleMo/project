package com.inventoryms.mapper;

import com.inventoryms.dto.request.CustomerCreateRequest;
import com.inventoryms.dto.response.CustomerResponse;
import com.inventoryms.entity.Customer;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    
    CustomerResponse toResponse(Customer customer);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "totalOrders", ignore = true)
    @Mapping(target = "totalSpent", ignore = true)
    @Mapping(target = "lastOrderDate", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Customer toEntity(CustomerCreateRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "totalOrders", ignore = true)
    @Mapping(target = "totalSpent", ignore = true)
    @Mapping(target = "lastOrderDate", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(CustomerCreateRequest request, @MappingTarget Customer customer);
}