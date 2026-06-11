package com.platform.educativa.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuestionRequest {
    @NotNull(message = "El ID del quiz es requerido")
    private Long quizId;
    
    @NotBlank(message = "El texto de la pregunta es requerido")
    private String text;
    
    private Integer orderIndex;
}
