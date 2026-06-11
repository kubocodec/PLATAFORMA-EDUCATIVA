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
public class QuizAttemptDto {
    private Long id;
    private Long userId;
    private Long quizId;
    private Double score;
    private boolean passed;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
