package com.platform.educativa.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class AnswerOptionRequest {
    @NotNull(message = "El ID de la pregunta es requerido")
    private Long questionId;
    
    @NotBlank(message = "El texto de la opción es requerido")
    private String text;
    
    @JsonProperty("isCorrect")
    private boolean isCorrect;
}
