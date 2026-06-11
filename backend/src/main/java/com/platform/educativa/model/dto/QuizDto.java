package com.platform.educativa.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDto {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private Integer timeLimitMinutes;
    private Double minScoreToPass;
    private boolean active;
    private List<QuestionDto> questions;
}
