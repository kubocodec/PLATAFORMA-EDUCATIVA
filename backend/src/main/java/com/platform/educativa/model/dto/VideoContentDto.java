package com.platform.educativa.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoContentDto {
    private Long id;
    private Long moduleId;
    private String title;
    private String description;
    private String videoUrl;
    private boolean isLocalFile;
    private Integer durationMinutes;
    private Integer orderIndex;
}
