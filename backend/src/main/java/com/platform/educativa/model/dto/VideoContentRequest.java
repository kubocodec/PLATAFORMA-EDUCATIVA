package com.platform.educativa.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VideoContentRequest {
    @NotNull(message = "El ID del módulo es requerido")
    private Long moduleId;
    
    @NotBlank(message = "El título es requerido")
    private String title;
    
    private String description;
    
    @NotBlank(message = "La URL del video es requerida")
    private String videoUrl;
    
    private boolean isLocalFile;
    private Integer durationMinutes;
    private Integer orderIndex;
}
