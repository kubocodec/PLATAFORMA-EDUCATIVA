package com.platform.educativa.controller;

import com.platform.educativa.model.dto.*;
import com.platform.educativa.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<QuizDto> getQuizByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(quizService.getQuizByCourse(courseId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuizDto> createOrUpdateQuiz(@Valid @RequestBody QuizRequest request) {
        return new ResponseEntity<>(quizService.createOrUpdateQuiz(request), HttpStatus.CREATED);
    }

    @PostMapping("/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionDto> addQuestion(@Valid @RequestBody QuestionRequest request) {
        return new ResponseEntity<>(quizService.addQuestion(request), HttpStatus.CREATED);
    }

    @PostMapping("/options")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnswerOptionDto> addOption(@Valid @RequestBody AnswerOptionRequest request) {
        return new ResponseEntity<>(quizService.addOption(request), HttpStatus.CREATED);
    }

    @PutMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionDto> updateQuestion(@PathVariable Long id, @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(quizService.updateQuestion(id, request));
    }

    @DeleteMapping("/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        quizService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/options/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnswerOptionDto> updateOption(@PathVariable Long id, @Valid @RequestBody AnswerOptionRequest request) {
        return ResponseEntity.ok(quizService.updateOption(id, request));
    }

    @DeleteMapping("/options/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOption(@PathVariable Long id) {
        quizService.deleteOption(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/submit")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<QuizAttemptDto> submitQuiz(
            @Valid @RequestBody QuizSubmitRequest request,
            Authentication authentication) {
        
        return ResponseEntity.ok(quizService.submitQuiz(authentication.getName(), request));
    }
}
