package com.platform.educativa.model.dto;

import com.platform.educativa.model.enums.ModuleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleDto {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private ModuleType type;
    private Integer orderIndex;
    private boolean active;
    
    // Contenidos
    private List<VideoContentDto> videos;
    private List<TextContentDto> texts;
    private List<DownloadLinkDto> downloads;
}
