import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService, Quiz, Question, AnswerOption } from '../../../../core/services/quiz.service';
import { CourseService, Course } from '../../../../core/services/course.service';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-manage-quiz',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    CardModule, ButtonModule, InputTextModule, InputTextareaModule, InputNumberModule,
    ToastModule, DialogModule, AccordionModule, TableModule, CheckboxModule, RadioButtonModule, TooltipModule
  ],
  providers: [MessageService],
  template: `
    <div class="p-4">
      <p-toast></p-toast>
      <div class="flex justify-content-between align-items-center mb-4">
        <div class="flex align-items-center gap-3">
          <p-button icon="pi pi-arrow-left" styleClass="p-button-rounded p-button-secondary p-button-text" (onClick)="goBack()" pTooltip="Volver a Módulos"></p-button>
          <div>
            <h2 class="m-0 text-2xl font-semibold">Examen Final del Curso</h2>
            <p class="m-0 text-500" *ngIf="course">{{course.title}}</p>
          </div>
        </div>
        <p-button label="Guardar Configuración" icon="pi pi-save" (onClick)="saveQuizSettings()" [disabled]="quizForm.invalid"></p-button>
      </div>

      <!-- Configuración del Quiz -->
      <div class="glass-panel p-4 mb-4">
        <form [formGroup]="quizForm" class="grid formgrid p-fluid">
          <div class="col-12 md:col-6 field">
            <label for="title">Título del Examen *</label>
            <input pInputText id="title" formControlName="title" placeholder="Ej. Examen de Certificación" />
          </div>
          
          <div class="col-12 md:col-3 field">
            <label for="timeLimitMinutes">Tiempo Límite (minutos) *</label>
            <p-inputNumber id="timeLimitMinutes" formControlName="timeLimitMinutes" mode="decimal" [showButtons]="true" [min]="0"></p-inputNumber>
          </div>

          <div class="col-12 md:col-3 field">
            <label for="minScoreToPass">Puntaje mínimo para aprobar (%) *</label>
            <p-inputNumber id="minScoreToPass" formControlName="minScoreToPass" mode="decimal" [showButtons]="true" [min]="0" [max]="100"></p-inputNumber>
          </div>

          <div class="col-12 field mb-0">
            <label for="description">Descripción e Instrucciones</label>
            <textarea pInputTextarea id="description" formControlName="description" rows="3"></textarea>
          </div>
        </form>
      </div>

      <!-- Área de Preguntas -->
      <div class="flex justify-content-between align-items-center mb-3 mt-5" *ngIf="quiz?.id">
        <h3 class="m-0 text-xl">Banco de Preguntas ({{quiz?.questions?.length || 0}})</h3>
        <p-button label="Añadir Pregunta" icon="pi pi-plus" styleClass="p-button-success" (onClick)="openQuestionDialog()"></p-button>
      </div>

      <div *ngIf="!quiz?.id" class="p-message p-message-warn">
        Primero debes guardar la configuración inicial del examen para poder empezar a agregar preguntas.
      </div>

      <!-- Acordeón de Preguntas -->
      <p-accordion [multiple]="true" *ngIf="quiz?.id">
        <p-accordionTab *ngFor="let q of quiz!.questions; let i = index">
          <ng-template pTemplate="header">
            <div class="flex justify-content-between align-items-center w-full pr-3">
              <span class="font-bold text-lg"><span class="text-500 mr-2">#{{i+1}}</span> {{q.text}}</span>
              <div class="flex gap-2" (click)="$event.stopPropagation()">
                <p-button icon="pi pi-pencil" styleClass="p-button-rounded p-button-text p-button-info p-0" (onClick)="editQuestion(q)"></p-button>
                <p-button icon="pi pi-trash" styleClass="p-button-rounded p-button-text p-button-danger p-0" (onClick)="deleteQuestion(q.id!)"></p-button>
              </div>
            </div>
          </ng-template>

          <!-- Opciones de la Pregunta -->
          <div class="pl-4">
            <div class="flex justify-content-between align-items-center mb-2">
              <span class="text-sm font-semibold text-500 uppercase">Opciones de Respuesta:</span>
              <p-button label="Agregar Opción" icon="pi pi-plus" size="small" styleClass="p-button-text p-button-sm" (onClick)="openOptionDialog(q)"></p-button>
            </div>

            <p-table [value]="q.options || []" responsiveLayout="scroll" styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr>
                  <th style="width: 3rem">Correcta</th>
                  <th>Texto de la Opción</th>
                  <th style="width: 8rem; text-align: center">Acciones</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-opt>
                <tr [class.bg-green-50]="opt.isCorrect">
                  <td class="text-center">
                    <i class="pi pi-check-circle text-green-500 text-xl" *ngIf="opt.isCorrect" pTooltip="Respuesta Correcta"></i>
                    <i class="pi pi-circle text-300 text-xl cursor-pointer hover:text-green-400 transition-colors" *ngIf="!opt.isCorrect" (click)="markAsCorrect(q, opt)" pTooltip="Marcar como correcta"></i>
                  </td>
                  <td [class.font-bold]="opt.isCorrect" [class.text-green-700]="opt.isCorrect">{{opt.text}}</td>
                  <td class="text-center">
                    <p-button icon="pi pi-pencil" styleClass="p-button-rounded p-button-text p-button-info p-0 mr-1" (onClick)="editOption(q, opt)"></p-button>
                    <p-button icon="pi pi-trash" styleClass="p-button-rounded p-button-text p-button-danger p-0" (onClick)="deleteOption(opt.id!)"></p-button>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr>
                  <td colspan="3" class="text-center p-3 text-500">No hay opciones registradas. Añade al menos dos opciones y marca una como correcta.</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </p-accordionTab>
      </p-accordion>

      <!-- Dialogo Pregunta -->
      <p-dialog [(visible)]="questionDialog" [header]="isEditingQuestion ? 'Editar Pregunta' : 'Nueva Pregunta'" [modal]="true" [style]="{width: '500px'}" styleClass="p-fluid">
        <ng-template pTemplate="content">
          <div class="field mt-2">
            <label for="qText">Enunciado de la Pregunta *</label>
            <textarea pInputTextarea id="qText" [(ngModel)]="currentQuestion.text" rows="3" required></textarea>
          </div>
        </ng-template>
        <ng-template pTemplate="footer">
          <p-button label="Cancelar" icon="pi pi-times" styleClass="p-button-text" (onClick)="questionDialog = false"></p-button>
          <p-button label="Guardar" icon="pi pi-check" (onClick)="saveQuestion()" [disabled]="!currentQuestion.text"></p-button>
        </ng-template>
      </p-dialog>

      <!-- Dialogo Opción -->
      <p-dialog [(visible)]="optionDialog" [header]="isEditingOption ? 'Editar Opción' : 'Nueva Opción'" [modal]="true" [style]="{width: '400px'}" styleClass="p-fluid">
        <ng-template pTemplate="content">
          <div class="field mt-2">
            <label for="oText">Texto de la Opción *</label>
            <input pInputText id="oText" [(ngModel)]="currentOption.text" required />
          </div>
          <div class="field-checkbox mt-3">
            <p-checkbox [(ngModel)]="currentOption.isCorrect" [binary]="true" inputId="isCorrect"></p-checkbox>
            <label for="isCorrect" class="ml-2 font-bold text-green-600">Esta es la respuesta correcta</label>
          </div>
        </ng-template>
        <ng-template pTemplate="footer">
          <p-button label="Cancelar" icon="pi pi-times" styleClass="p-button-text" (onClick)="optionDialog = false"></p-button>
          <p-button label="Guardar" icon="pi pi-check" (onClick)="saveOption()" [disabled]="!currentOption.text"></p-button>
        </ng-template>
      </p-dialog>

    </div>
  `
})
export class ManageQuizComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizService = inject(QuizService);
  private courseService = inject(CourseService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  courseId!: number;
  course?: Course;
  quiz: Quiz | null = null;

  quizForm: FormGroup = this.fb.group({
    title: ['Examen Final', Validators.required],
    description: [''],
    timeLimitMinutes: [30, [Validators.required, Validators.min(1)]],
    minScoreToPass: [70, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  // Estado UI Preguntas
  questionDialog = false;
  isEditingQuestion = false;
  currentQuestion: Partial<Question> = {};

  // Estado UI Opciones
  optionDialog = false;
  isEditingOption = false;
  currentOption: Partial<AnswerOption> = {};
  selectedQuestionForOption: Question | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('courseId');
      if (id) {
        this.courseId = +id;
        this.loadCourse();
        this.loadQuiz();
      } else {
        this.router.navigate(['/admin/courses']);
      }
    });
  }

  loadCourse() {
    this.courseService.getById(this.courseId).subscribe(data => this.course = data);
  }

  loadQuiz() {
    this.quizService.getByCourse(this.courseId).subscribe({
      next: (data: Quiz) => {
        this.quiz = data;
        this.quizForm.patchValue(this.quiz || {});
      },
      error: () => {
        // El quiz aun no existe
        this.quiz = null;
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/courses', this.courseId, 'modules']);
  }

  // --- CRUD QUIZ ---
  saveQuizSettings() {
    if (this.quizForm.invalid) return;

    const quizData: Quiz = {
      ...(this.quiz || {}),
      ...this.quizForm.value,
      courseId: this.courseId,
      active: true
    } as Quiz;

    this.quizService.createOrUpdateQuiz(quizData).subscribe({
      next: (res) => {
        this.quiz = res;
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Configuración guardada'});
      },
      error: () => this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo guardar'})
    });
  }

  // --- CRUD PREGUNTAS ---
  openQuestionDialog() {
    this.isEditingQuestion = false;
    this.currentQuestion = { text: '', orderIndex: (this.quiz?.questions?.length || 0) + 1 };
    this.questionDialog = true;
  }

  editQuestion(q: Question) {
    this.isEditingQuestion = true;
    this.currentQuestion = { ...q };
    this.questionDialog = true;
  }

  saveQuestion() {
    if (!this.quiz?.id || !this.currentQuestion.text) return;

    const qReq: Question = {
      ...this.currentQuestion,
      quizId: this.quiz.id
    } as Question;

    if (this.isEditingQuestion && qReq.id) {
      this.quizService.updateQuestion(qReq.id, qReq).subscribe({
        next: () => { this.loadQuiz(); this.questionDialog = false; },
        error: () => this.messageService.add({severity:'error', summary:'Error', detail:'Error al actualizar'})
      });
    } else {
      this.quizService.addQuestion(qReq).subscribe({
        next: () => { this.loadQuiz(); this.questionDialog = false; },
        error: () => this.messageService.add({severity:'error', summary:'Error', detail:'Error al crear'})
      });
    }
  }

  deleteQuestion(id: number) {
    if (confirm('¿Estás seguro de eliminar esta pregunta?')) {
      this.quizService.deleteQuestion(id).subscribe({
        next: () => { this.loadQuiz(); this.messageService.add({severity:'success', summary:'Eliminado', detail:'Pregunta borrada'}); },
        error: () => this.messageService.add({severity:'error', summary:'Error', detail:'Error al borrar'})
      });
    }
  }

  // --- CRUD OPCIONES ---
  openOptionDialog(q: Question) {
    this.selectedQuestionForOption = q;
    this.isEditingOption = false;
    this.currentOption = { text: '', isCorrect: false };
    this.optionDialog = true;
  }

  editOption(q: Question, opt: AnswerOption) {
    this.selectedQuestionForOption = q;
    this.isEditingOption = true;
    this.currentOption = { ...opt };
    this.optionDialog = true;
  }

  saveOption() {
    if (!this.selectedQuestionForOption?.id || !this.currentOption.text) return;

    const oReq: AnswerOption = {
      ...this.currentOption,
      questionId: this.selectedQuestionForOption.id
    } as AnswerOption;

    if (this.isEditingOption && oReq.id) {
      this.quizService.updateOption(oReq.id, oReq).subscribe({
        next: () => { this.loadQuiz(); this.optionDialog = false; },
        error: () => this.messageService.add({severity:'error', summary:'Error', detail:'Error al actualizar'})
      });
    } else {
      this.quizService.addOption(oReq).subscribe({
        next: () => { this.loadQuiz(); this.optionDialog = false; },
        error: () => this.messageService.add({severity:'error', summary:'Error', detail:'Error al crear'})
      });
    }
  }

  deleteOption(id: number) {
    if (confirm('¿Estás seguro de eliminar esta opción?')) {
      this.quizService.deleteOption(id).subscribe({
        next: () => { this.loadQuiz(); },
        error: () => this.messageService.add({severity:'error', summary:'Error', detail:'Error al borrar'})
      });
    }
  }

  markAsCorrect(q: Question, opt: AnswerOption) {
    // Para simplificar la vida del admin, cuando marca una como correcta, 
    // idealmente las demás de la misma pregunta deberian desmarcarse en BD si solo hay una correcta permitida.
    // Como el backend no hace esto automaticamente, lo hacemos actualizando.
    // Actualizamos la opción elegida a isCorrect = true:
    const oReq: AnswerOption = { ...opt, isCorrect: true };
    this.quizService.updateOption(opt.id!, oReq).subscribe({
      next: () => {
        // Optional: podríamos recorrer las demas y ponerlas en false enviando PUT requests...
        // pero por ahora recargamos
        this.loadQuiz();
        this.messageService.add({severity:'success', summary:'Actualizado', detail:'Opción marcada como correcta'});
      }
    });
  }
}
