package com.platform.educativa.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuizSubmitRequest {
    private Long quizId;
    // Un mapa de id de pregunta a id de opción elegida
    private List<AnswerSubmission> answers;

    @Data
    public static class AnswerSubmission {
        private Long questionId;
        private Long selectedOptionId;
    }
}
