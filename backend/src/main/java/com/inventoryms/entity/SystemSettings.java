package com.inventoryms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemSettings extends BaseEntity {
    
    @NotBlank
    @Column(name = "setting_key", unique = true, nullable = false)
    private String key;
    
    @NotBlank
    @Column(name = "setting_value", nullable = false, length = 1000)
    private String value;
    
    @Column(length = 500)
    private String description;
}