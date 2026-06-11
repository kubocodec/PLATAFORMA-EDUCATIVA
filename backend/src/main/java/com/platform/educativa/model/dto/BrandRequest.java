package com.platform.educativa.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BrandRequest {
    @NotBlank(message = "El nombre de la marca es requerido")
    private String name;
    
    private String description;
    private String logoUrl;
    private boolean active = true;
}
