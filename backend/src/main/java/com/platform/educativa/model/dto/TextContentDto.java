package com.platform.educativa.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TextContentDto {
    private Long id;
    private Long moduleId;
    private String title;
    private String content;
    private Integer orderIndex;
}
