package com.platform.educativa.model.dto;

import com.platform.educativa.model.enums.ModuleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ModuleRequest {
    @NotNull(message = "El ID del curso es requerido")
    private Long courseId;

    @NotBlank(message = "El título es requerido")
    private String title;

    private String description;

    @NotNull(message = "El tipo de módulo es requerido")
    private ModuleType type;

    private Integer orderIndex;
    private boolean active = true;
}
