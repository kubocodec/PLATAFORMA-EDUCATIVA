package com.platform.educativa.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerOptionDto {
    private Long id;
    private Long questionId;
    private String text;
    @JsonProperty("isCorrect")
    private boolean isCorrect;
}
