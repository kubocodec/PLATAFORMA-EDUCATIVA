package com.platform.educativa.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private Long id;
    private Long brandId;
    private String brandName;
    private String title;
    private String description;
    private String coverImageUrl;
    private Integer orderIndex;
    private boolean active;
    private LocalDateTime createdAt;
}
