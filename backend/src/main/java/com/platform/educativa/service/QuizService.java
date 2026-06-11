package com.platform.educativa.service;

import com.platform.educativa.model.dto.*;
import com.platform.educativa.model.entity.*;
import com.platform.educativa.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CertificateService certificateService;

    // --- CRUD DE QUIZZES ---
    
    public QuizDto getQuizByCourse(Long courseId) {
        Quiz quiz = quizRepository.findByCourseId(courseId)
                .orElseThrow(() -> new IllegalArgumentException("No hay cuestionario para el curso " + courseId));
        return mapToDto(quiz);
    }

    @Transactional
    public QuizDto createOrUpdateQuiz(QuizRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Curso no encontrado"));

        Quiz quiz = quizRepository.findByCourseId(course.getId()).orElse(new Quiz());
        quiz.setCourse(course);
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setMinScoreToPass(request.getMinScoreToPass());
        quiz.setActive(request.isActive());

        return mapToDto(quizRepository.save(quiz));
    }

    // --- CRUD DE PREGUNTAS Y OPCIONES ---

    @Transactional
    public QuestionDto addQuestion(QuestionRequest request) {
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new IllegalArgumentException("Quiz no encontrado"));
                
        Question q = new Question();
        q.setQuiz(quiz);
        q.setText(request.getText());
        q.setOrderIndex(request.getOrderIndex());
        
        return mapQuestionToDto(questionRepository.save(q));
    }

    @Transactional
    public AnswerOptionDto addOption(AnswerOptionRequest request) {
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada"));
                
        AnswerOption option = new AnswerOption();
        option.setQuestion(question);
        option.setText(request.getText());
        option.setCorrect(request.isCorrect());
        
        return mapOptionToDto(answerOptionRepository.save(option));
    }

    @Transactional
    public QuestionDto updateQuestion(Long questionId, QuestionRequest request) {
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Pregunta no encontrada"));
        q.setText(request.getText());
        q.setOrderIndex(request.getOrderIndex());
        return mapQuestionToDto(questionRepository.save(q));
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new IllegalArgumentException("Pregunta no encontrada");
        }
        questionRepository.deleteById(questionId);
    }

    @Transactional
    public AnswerOptionDto updateOption(Long optionId, AnswerOptionRequest request) {
        AnswerOption option = answerOptionRepository.findById(optionId)
                .orElseThrow(() -> new IllegalArgumentException("Opción no encontrada"));
        option.setText(request.getText());
        option.setCorrect(request.isCorrect());
        return mapOptionToDto(answerOptionRepository.save(option));
    }

    @Transactional
    public void deleteOption(Long optionId) {
        if (!answerOptionRepository.existsById(optionId)) {
            throw new IllegalArgumentException("Opción no encontrada");
        }
        answerOptionRepository.deleteById(optionId);
    }

    // --- LÓGICA DE EVALUACIÓN ---

    @Transactional
    public QuizAttemptDto submitQuiz(String email, QuizSubmitRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
                
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new IllegalArgumentException("Quiz no encontrado"));

        List<Question> questions = quiz.getQuestions();
        int totalQuestions = questions.size();
        if (totalQuestions == 0) throw new IllegalArgumentException("El quiz no tiene preguntas");

        int correctAnswers = 0;

        // Crear mapa rápido de respuestas correctas
        Map<Long, Long> correctOptionsMap = questions.stream()
            .collect(Collectors.toMap(
                Question::getId,
                q -> q.getOptions().stream().filter(AnswerOption::isCorrect).findFirst().map(AnswerOption::getId).orElse(-1L)
            ));

        for (QuizSubmitRequest.AnswerSubmission submission : request.getAnswers()) {
            Long correctOptionId = correctOptionsMap.get(submission.getQuestionId());
            if (correctOptionId != null && correctOptionId.equals(submission.getSelectedOptionId())) {
                correctAnswers++;
            }
        }

        double score = ((double) correctAnswers / totalQuestions) * 100.0;
        boolean passed = score >= quiz.getMinScoreToPass();

        QuizAttempt attempt = QuizAttempt.builder()
                .user(user)
                .quiz(quiz)
                .score(score)
                .passed(passed)
                .completedAt(LocalDateTime.now())
                .build();
                
        attempt = quizAttemptRepository.save(attempt);

        // Si aprobó, generar el certificado
        if (passed) {
            certificateService.generateCertificate(user, quiz.getCourse());
        }

        return QuizAttemptDto.builder()
                .id(attempt.getId())
                .userId(user.getId())
                .quizId(quiz.getId())
                .score(score)
                .passed(passed)
                .startedAt(attempt.getStartedAt())
                .completedAt(attempt.getCompletedAt())
                .build();
    }

    // --- MAPPERS ---
    
    private QuizDto mapToDto(Quiz quiz) {
        return QuizDto.builder()
                .id(quiz.getId())
                .courseId(quiz.getCourse().getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .timeLimitMinutes(quiz.getTimeLimitMinutes())
                .minScoreToPass(quiz.getMinScoreToPass())
                .active(quiz.isActive())
                .questions(quiz.getQuestions() != null ? 
                    quiz.getQuestions().stream().map(this::mapQuestionToDto).collect(Collectors.toList()) : null)
                .build();
    }

    private QuestionDto mapQuestionToDto(Question q) {
        return QuestionDto.builder()
                .id(q.getId())
                .quizId(q.getQuiz().getId())
                .text(q.getText())
                .orderIndex(q.getOrderIndex())
                .options(q.getOptions() != null ? 
                    q.getOptions().stream().map(this::mapOptionToDto).collect(Collectors.toList()) : null)
                .build();
    }

    private AnswerOptionDto mapOptionToDto(AnswerOption o) {
        return AnswerOptionDto.builder()
                .id(o.getId())
                .questionId(o.getQuestion().getId())
                .text(o.getText())
                .isCorrect(o.isCorrect()) // Para el frontend podríamos ocultar esto si no es admin, pero por simplicidad lo enviamos
                .build();
    }
}
