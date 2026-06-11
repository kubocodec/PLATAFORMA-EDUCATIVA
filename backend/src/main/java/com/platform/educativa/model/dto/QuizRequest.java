package com.platform.educativa.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuizRequest {
    @NotNull(message = "El ID del curso es requerido")
    private Long courseId;
    
    @NotBlank(message = "El título es requerido")
    private String title;
    
    private String description;
    
    @NotNull(message = "El tiempo límite es requerido")
    private Integer timeLimitMinutes;
    
    @NotNull(message = "El puntaje mínimo para aprobar es requerido")
    private Double minScoreToPass;
    
    private boolean active = true;
}
