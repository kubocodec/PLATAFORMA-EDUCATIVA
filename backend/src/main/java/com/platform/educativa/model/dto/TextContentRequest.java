package com.platform.educativa.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TextContentRequest {
    @NotNull(message = "El ID del módulo es requerido")
    private Long moduleId;
    
    @NotBlank(message = "El título es requerido")
    private String title;
    
    @NotBlank(message = "El contenido es requerido")
    private String content;
    
    private Integer orderIndex;
}
