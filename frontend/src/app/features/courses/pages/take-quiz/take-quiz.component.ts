import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService, Quiz, QuizAttempt } from '../../../../core/services/quiz.service';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-take-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, RadioButtonModule, ProgressBarModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="p-4 flex justify-content-center min-h-screen align-items-center" style="background: var(--surface-ground);">
      <p-toast></p-toast>
      <div class="glass-panel w-full md:w-8 lg:w-6 p-5 relative" *ngIf="quiz">
        
        <!-- Timer -->
        <div class="absolute top-0 right-0 p-3 m-3 border-round bg-primary font-bold text-xl shadow-4" *ngIf="!attemptResult">
          <i class="pi pi-clock mr-2"></i> {{ minutesLeft | number:'2.0' }}:{{ secondsLeft | number:'2.0' }}
        </div>

        <h1 class="text-3xl font-bold mb-2">{{ quiz.title }}</h1>
        <p class="text-500 mb-4">{{ quiz.description }}</p>

        <ng-container *ngIf="!attemptResult">
          <!-- Quiz Questions -->
          <div class="mb-4">
            <h3 class="text-xl mb-3">Pregunta {{ currentQuestionIndex + 1 }} de {{ quiz.questions.length }}</h3>
            <p-progressBar [value]="progressPercentage" [showValue]="false" styleClass="h-1rem mb-4"></p-progressBar>
            
            <div class="text-xl font-medium mb-4">
              {{ currentQuestion.text }}
            </div>

            <div class="flex flex-column gap-3">
              <div *ngFor="let option of currentQuestion.options" class="p-3 border-round surface-border border-1 hover:surface-hover cursor-pointer flex align-items-center" (click)="selectOption(option.id)">
                <p-radioButton [name]="'q' + currentQuestion.id" [value]="option.id" [(ngModel)]="answers[currentQuestion.id]" [inputId]="'opt' + option.id"></p-radioButton>
                <label [for]="'opt' + option.id" class="ml-2 cursor-pointer w-full text-lg">{{ option.text }}</label>
              </div>
            </div>
          </div>

          <div class="flex justify-content-between mt-5">
            <p-button label="Anterior" icon="pi pi-arrow-left" (onClick)="prevQuestion()" [disabled]="currentQuestionIndex === 0" styleClass="p-button-outlined"></p-button>
            <p-button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" (onClick)="nextQuestion()" *ngIf="currentQuestionIndex < quiz.questions.length - 1"></p-button>
            <p-button label="Finalizar Cuestionario" icon="pi pi-check" styleClass="p-button-success" (onClick)="submitQuiz()" *ngIf="currentQuestionIndex === quiz.questions.length - 1"></p-button>
          </div>
        </ng-container>

        <!-- Result View -->
        <div *ngIf="attemptResult" class="text-center py-5">
          <div class="mb-4">
            <i class="pi pi-check-circle text-8xl text-green-500" *ngIf="attemptResult.passed"></i>
            <i class="pi pi-times-circle text-8xl text-red-500" *ngIf="!attemptResult.passed"></i>
          </div>
          <h2 class="text-4xl font-bold mb-2">{{ attemptResult.passed ? '¡Felicidades!' : 'No Aprobado' }}</h2>
          <p class="text-xl mb-4">Tu puntuación: <span class="font-bold text-primary">{{ attemptResult.score | number:'1.0-1' }}%</span></p>
          <p class="text-500 mb-5">Puntuación mínima requerida: {{ quiz.minScoreToPass }}%</p>
          
          <div class="flex justify-content-center gap-3">
            <p-button label="Volver al Curso" icon="pi pi-arrow-left" styleClass="p-button-outlined" (onClick)="goBack()"></p-button>
            <p-button label="Ver Certificado" icon="pi pi-file-pdf" styleClass="p-button-success" *ngIf="attemptResult.passed" (onClick)="viewCertificate()"></p-button>
            <p-button label="Reintentar" icon="pi pi-refresh" *ngIf="!attemptResult.passed" (onClick)="retryQuiz()"></p-button>
          </div>
        </div>

      </div>
    </div>
  `
})
export class TakeQuizComponent implements OnInit, OnDestroy {
  private quizService = inject(QuizService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  courseId!: number;
  quiz!: Quiz;
  currentQuestionIndex = 0;
  answers: { [questionId: number]: number } = {};
  attemptResult: QuizAttempt | null = null;

  // Timer
  timerInterval: any;
  totalSeconds = 0;

  get currentQuestion() {
    return this.quiz.questions[this.currentQuestionIndex];
  }

  get progressPercentage() {
    return ((this.currentQuestionIndex + 1) / this.quiz.questions.length) * 100;
  }

  get minutesLeft() {
    return Math.floor(this.totalSeconds / 60);
  }

  get secondsLeft() {
    return this.totalSeconds % 60;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      if (this.courseId) {
        this.loadQuiz();
      }
    });
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  loadQuiz() {
    this.quizService.getByCourse(this.courseId).subscribe({
      next: (data) => {
        this.quiz = data;
        this.totalSeconds = this.quiz.timeLimitMinutes * 60;
        this.startTimer();
      },
      error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo cargar el cuestionario'})
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
      } else {
        this.stopTimer();
        this.messageService.add({severity: 'warn', summary: 'Tiempo agotado', detail: 'El tiempo para el cuestionario ha terminado.'});
        this.submitQuiz();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  selectOption(optionId: number) {
    this.answers[this.currentQuestion.id] = optionId;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz() {
    this.stopTimer();
    
    // Convertir el objeto map a un array
    const answersArray = Object.keys(this.answers).map(qId => ({
      questionId: Number(qId),
      selectedOptionId: this.answers[Number(qId)]
    }));

    this.quizService.submit({ quizId: this.quiz.id, answers: answersArray }).subscribe({
      next: (result) => {
        this.attemptResult = result;
      },
      error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ocurrió un error al enviar el cuestionario'})
    });
  }

  retryQuiz() {
    this.attemptResult = null;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.totalSeconds = this.quiz.timeLimitMinutes * 60;
    this.startTimer();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  viewCertificate() {
    this.router.navigate(['/certificates']);
  }
}
