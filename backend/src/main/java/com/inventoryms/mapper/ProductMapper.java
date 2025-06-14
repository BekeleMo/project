package com.inventoryms.mapper;

import com.inventoryms.dto.request.ProductCreateRequest;
import com.inventoryms.dto.response.ProductResponse;
import com.inventoryms.entity.Product;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    
    ProductResponse toResponse(Product product);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    Product toEntity(ProductCreateRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(ProductCreateRequest request, @MappingTarget Product product);
}