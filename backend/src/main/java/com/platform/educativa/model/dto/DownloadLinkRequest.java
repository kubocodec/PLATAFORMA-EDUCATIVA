package com.platform.educativa.model.dto;

import com.platform.educativa.model.enums.FileType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DownloadLinkRequest {
    @NotNull(message = "El ID del módulo es requerido")
    private Long moduleId;
    
    @NotBlank(message = "El título es requerido")
    private String title;
    
    private String description;
    
    @NotBlank(message = "La URL es requerida")
    private String url;
    
    private boolean isLocalFile;
    
    @NotNull(message = "El tipo de archivo es requerido")
    private FileType fileType;
    
    private Integer orderIndex;
}
