package com.platform.educativa.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseRequest {
    @NotNull(message = "El ID de la marca es requerido")
    private Long brandId;

    @NotBlank(message = "El título del curso es requerido")
    private String title;

    private String description;
    private String coverImageUrl;
    private Integer orderIndex;
    private boolean active = true;
}
