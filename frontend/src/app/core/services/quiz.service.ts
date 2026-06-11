import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AnswerOption {
  id: number;
  questionId: number;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: number;
  quizId: number;
  text: string;
  orderIndex: number;
  options: AnswerOption[];
}

export interface Quiz {
  id: number;
  courseId: number;
  title: string;
  description: string;
  timeLimitMinutes: number;
  minScoreToPass: number;
  active: boolean;
  questions: Question[];
}

export interface QuizSubmission {
  quizId: number;
  answers: { questionId: number; selectedOptionId: number }[];
}

export interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/quizzes`;

  getByCourse(courseId: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/course/${courseId}`);
  }

  submit(submission: QuizSubmission): Observable<QuizAttempt> {
    return this.http.post<QuizAttempt>(`${this.apiUrl}/submit`, submission);
  }

  // --- Admin Methods ---

  createOrUpdateQuiz(quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, quiz);
  }

  addQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions`, question);
  }

  updateQuestion(id: number, question: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/questions/${id}`, question);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/questions/${id}`);
  }

  addOption(option: Partial<AnswerOption>): Observable<AnswerOption> {
    return this.http.post<AnswerOption>(`${this.apiUrl}/options`, option);
  }

  updateOption(id: number, option: Partial<AnswerOption>): Observable<AnswerOption> {
    return this.http.put<AnswerOption>(`${this.apiUrl}/options/${id}`, option);
  }

  deleteOption(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/options/${id}`);
  }
}
