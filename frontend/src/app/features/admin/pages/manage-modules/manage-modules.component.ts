import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleService, CourseModule, ModuleContent } from '../../../../core/services/module.service';
import { CourseService, Course } from '../../../../core/services/course.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-manage-modules',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, ButtonModule, DialogModule, InputTextModule,
    InputTextareaModule, DropdownModule, ToastModule, InputSwitchModule,
    EditorModule
  ],
  providers: [MessageService],
  template: `
    <div class="p-4">
      <p-toast></p-toast>
      <div class="flex justify-content-between align-items-center mb-4">
        <div class="flex align-items-center gap-3">
          <p-button icon="pi pi-arrow-left" styleClass="p-button-rounded p-button-secondary p-button-text" (onClick)="goBack()" pTooltip="Volver a Cursos"></p-button>
          <div>
            <h2 class="m-0 text-2xl font-semibold">Módulos del Curso</h2>
            <p class="m-0 text-500" *ngIf="course">{{course.title}}</p>
          </div>
        </div>
        <p-button label="Nuevo Módulo" icon="pi pi-plus" (onClick)="openNew()"></p-button>
      </div>

      <div class="glass-panel p-3">
        <p-table [value]="modules" [paginator]="true" [rows]="10" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th>Orden</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-mod>
            <tr>
              <td>{{mod.orderIndex}}</td>
              <td class="font-bold">{{mod.title}}</td>
              <td>
                <span class="p-badge p-badge-info">{{mod.type}}</span>
              </td>
              <td>
                <span [class]="'p-badge ' + (mod.active ? 'p-badge-success' : 'p-badge-danger')">
                  {{mod.active ? 'Activo' : 'Inactivo'}}
                </span>
              </td>
              <td>
                <p-button icon="pi pi-cog" styleClass="p-button-rounded p-button-help mr-2" pTooltip="Gestionar Contenido" (onClick)="openContentDialog(mod)"></p-button>
                <p-button icon="pi pi-pencil" styleClass="p-button-rounded p-button-success mr-2" (onClick)="editModule(mod)"></p-button>
                <p-button icon="pi pi-trash" styleClass="p-button-rounded p-button-danger" (onClick)="deleteModule(mod)"></p-button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center p-4">No hay módulos creados para este curso.</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Diálogo de Creación/Edición de Módulo -->
      <p-dialog [(visible)]="moduleDialog" [style]="{width: '450px'}" [header]="isEditing ? 'Editar Módulo' : 'Nuevo Módulo'" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
          <form [formGroup]="moduleForm" class="flex flex-column gap-3 mt-2">
            
            <div class="field">
              <label for="title">Título *</label>
              <input type="text" pInputText id="title" formControlName="title" required />
            </div>

            <div class="field">
              <label for="type">Tipo de Módulo *</label>
              <p-dropdown [options]="moduleTypes" formControlName="type" placeholder="Selecciona un tipo"></p-dropdown>
            </div>
            
            <div class="field">
              <label for="description">Descripción</label>
              <textarea id="description" pInputTextarea formControlName="description" rows="3"></textarea>
            </div>

            <div class="field w-4rem">
              <label for="orderIndex">Orden</label>
              <input type="number" pInputText id="orderIndex" formControlName="orderIndex" />
            </div>

            <div class="field flex align-items-center justify-content-between mt-2" *ngIf="isEditing">
              <label for="active" class="mb-0">Estado Activo</label>
              <p-inputSwitch id="active" formControlName="active"></p-inputSwitch>
            </div>
          </form>
        </ng-template>

        <ng-template pTemplate="footer">
          <p-button label="Cancelar" icon="pi pi-times" styleClass="p-button-text" (onClick)="hideDialog()"></p-button>
          <p-button label="Guardar" icon="pi pi-check" styleClass="p-button-primary" (onClick)="saveModule()"></p-button>
        </ng-template>
      </p-dialog>

      <!-- Diálogo para Agregar Contenido -->
      <p-dialog [(visible)]="contentDialog" [style]="{width: '500px'}" [header]="'Añadir Contenido: ' + (selectedModule?.type || '')" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
          <form [formGroup]="contentForm" class="flex flex-column gap-3 mt-2">
            
            <div class="field">
              <label for="contentTitle">Título del Contenido *</label>
              <input type="text" pInputText id="contentTitle" formControlName="title" required />
            </div>

            <div class="field">
              <label for="contentDesc">Descripción (Opcional)</label>
              <textarea id="contentDesc" pInputTextarea formControlName="description" rows="2"></textarea>
            </div>

            <!-- Campos Dinámicos según el tipo -->
            <div *ngIf="selectedModule?.type === 'TUTORIAL' || selectedModule?.type === 'INSTALLATION' || selectedModule?.type === 'RECHARGE'">
              <div class="field">
                <label for="videoUrl">URL del Video (YouTube / Vimeo / MP4) *</label>
                <input type="text" pInputText id="videoUrl" formControlName="videoUrl" />
              </div>
              <div class="field">
                <label for="durationMinutes">Duración (minutos)</label>
                <input type="number" pInputText id="durationMinutes" formControlName="durationMinutes" />
              </div>
            </div>

            <div *ngIf="selectedModule?.type === 'BENEFITS'">
              <div class="field">
                <label for="textContent">Contenido (Texto) *</label>
                <p-editor formControlName="content" [style]="{ height: '200px' }"></p-editor>
              </div>
            </div>

            <div *ngIf="selectedModule?.type === 'DRIVERS'">
              <div class="field">
                <label for="fileUrl">URL del Archivo *</label>
                <input type="text" pInputText id="fileUrl" formControlName="url" />
              </div>
              <div class="field">
                <label for="fileType">Tipo de Archivo</label>
                <p-dropdown [options]="fileTypes" formControlName="fileType" placeholder="Selecciona un tipo"></p-dropdown>
              </div>
            </div>

            <div *ngIf="selectedModule?.type === 'QUIZ'">
              <div class="p-message p-message-info">
                La gestión avanzada de preguntas de cuestionarios se habilitará en la siguiente actualización.
              </div>
            </div>
            
          </form>
        </ng-template>

        <ng-template pTemplate="footer">
          <p-button label="Cancelar" icon="pi pi-times" styleClass="p-button-text" (onClick)="contentDialog = false"></p-button>
          <p-button [label]="currentContentId ? 'Actualizar Contenido' : 'Guardar Contenido'" icon="pi pi-check" styleClass="p-button-primary" (onClick)="saveContent()"></p-button>
        </ng-template>
      </p-dialog>

    </div>
  `
})
export class ManageModulesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private moduleService = inject(ModuleService);
  private courseService = inject(CourseService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  courseId!: number;
  course?: Course;
  modules: CourseModule[] = [];
  
  moduleDialog = false;
  isEditing = false;
  currentModuleId?: number;

  contentDialog = false;
  selectedModule?: CourseModule;
  currentContentId?: number;

  moduleTypes = [
    { label: 'Tutorial (Video)', value: 'TUTORIAL' },
    { label: 'Beneficios (Texto)', value: 'BENEFITS' },
    { label: 'Instalación (Video)', value: 'INSTALLATION' },
    { label: 'Recargas (Video)', value: 'RECHARGE' },
    { label: 'Controladores (Descargas)', value: 'DRIVERS' },
    { label: 'Cuestionario (Examen)', value: 'QUIZ' }
  ];

  fileTypes = [
    { label: 'Driver', value: 'DRIVER' },
    { label: 'Software', value: 'SOFTWARE' },
    { label: 'Manual', value: 'MANUAL' },
    { label: 'Otro', value: 'OTHER' }
  ];

  moduleForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    type: ['TUTORIAL', Validators.required],
    description: [''],
    orderIndex: [0],
    active: [true]
  });

  contentForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    videoUrl: [''],
    durationMinutes: [0],
    content: [''],
    url: [''],
    fileType: ['DRIVER']
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('courseId');
      if (id) {
        this.courseId = +id;
        this.loadCourseData();
        this.loadModules();
      } else {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Debe seleccionar un curso primero.'});
        this.router.navigate(['/admin/courses']);
      }
    });
  }

  loadCourseData() {
    this.courseService.getAll(false).subscribe(courses => {
      this.course = courses.find(c => c.id === this.courseId);
    });
  }

  loadModules() {
    this.moduleService.getByCourse(this.courseId).subscribe({
      next: (data) => this.modules = data,
      error: () => this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar los módulos'})
    });
  }

  goBack() {
    this.router.navigate(['/admin/courses']);
  }

  openNew() {
    this.moduleForm.reset({ active: true, orderIndex: 0, type: 'TUTORIAL' });
    this.isEditing = false;
    this.moduleDialog = true;
  }

  editModule(mod: CourseModule) {
    this.currentModuleId = mod.id;
    this.moduleForm.patchValue(mod);
    this.isEditing = true;
    this.moduleDialog = true;
  }

  deleteModule(mod: CourseModule) {
    if(confirm(`¿Estás seguro que deseas eliminar el módulo ${mod.title}?`)) {
      this.moduleService.delete(mod.id!).subscribe({
        next: () => {
          this.loadModules();
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Módulo eliminado'});
        },
        error: () => this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo eliminar'})
      });
    }
  }

  hideDialog() {
    this.moduleDialog = false;
  }

  saveModule() {
    if (this.moduleForm.invalid) return;
    if (!this.courseId) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'No hay un curso seleccionado válido.'});
      return;
    }

    const moduleData: CourseModule = {
      ...this.moduleForm.value,
      courseId: this.courseId
    };

    if (this.isEditing && this.currentModuleId) {
      this.moduleService.update(this.currentModuleId, moduleData).subscribe({
        next: () => {
          this.loadModules();
          this.hideDialog();
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Módulo actualizado'});
        },
        error: () => this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al actualizar'})
      });
    } else {
      this.moduleService.create(moduleData).subscribe({
        next: () => {
          this.loadModules();
          this.hideDialog();
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Módulo creado'});
        },
        error: () => this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al crear'})
      });
    }
  }

  // Content Management

  openContentDialog(mod: CourseModule) {
    if (mod.type === 'QUIZ') {
      this.router.navigate(['/admin/courses', this.courseId, 'quiz']);
      return;
    }

    this.selectedModule = mod;
    this.currentContentId = undefined;
    this.contentForm.reset({
      title: '',
      description: '',
      durationMinutes: 0,
      fileType: 'DRIVER'
    });

    // Pre-fill existing content if available
    if (['TUTORIAL', 'INSTALLATION', 'RECHARGE'].includes(mod.type) && mod.videos && mod.videos.length > 0) {
      const video = mod.videos[0];
      this.currentContentId = video.id;
      this.contentForm.patchValue({
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        durationMinutes: video.durationMinutes
      });
    } else if (mod.type === 'BENEFITS' && mod.texts && mod.texts.length > 0) {
      const text = mod.texts[0];
      this.currentContentId = text.id;
      this.contentForm.patchValue({
        title: text.title,
        content: text.content
      });
    } else if (mod.type === 'DRIVERS' && mod.downloads && mod.downloads.length > 0) {
      const download = mod.downloads[0];
      this.currentContentId = download.id;
      this.contentForm.patchValue({
        title: download.title,
        description: download.description,
        url: download.url,
        fileType: download.fileType
      });
    }

    this.contentDialog = true;
  }

  saveContent() {
    if (!this.selectedModule || this.contentForm.invalid) return;

    const val = this.contentForm.value;
    const contentReq: ModuleContent = {
      moduleId: this.selectedModule.id!,
      title: val.title,
      description: val.description,
      orderIndex: 0,
      isLocalFile: false
    };

    if (['TUTORIAL', 'INSTALLATION', 'RECHARGE'].includes(this.selectedModule.type)) {
      contentReq.videoUrl = val.videoUrl;
      contentReq.durationMinutes = val.durationMinutes;
      if (this.currentContentId) {
        this.moduleService.updateVideo(this.currentContentId, contentReq).subscribe({
          next: () => this.contentSuccess(),
          error: () => this.contentError()
        });
      } else {
        this.moduleService.addVideo(contentReq).subscribe({
          next: () => this.contentSuccess(),
          error: () => this.contentError()
        });
      }
    } else if (this.selectedModule.type === 'BENEFITS') {
      contentReq.content = val.content;
      if (this.currentContentId) {
        this.moduleService.updateText(this.currentContentId, contentReq).subscribe({
          next: () => this.contentSuccess(),
          error: () => this.contentError()
        });
      } else {
        this.moduleService.addText(contentReq).subscribe({
          next: () => this.contentSuccess(),
          error: () => this.contentError()
        });
      }
    } else if (this.selectedModule.type === 'DRIVERS') {
      contentReq.url = val.url;
      contentReq.fileType = val.fileType;
      if (this.currentContentId) {
        this.moduleService.updateDownload(this.currentContentId, contentReq).subscribe({
          next: () => this.contentSuccess(),
          error: () => this.contentError()
        });
      } else {
        this.moduleService.addDownload(contentReq).subscribe({
          next: () => this.contentSuccess(),
          error: () => this.contentError()
        });
      }
    }
  }

  private contentSuccess() {
    this.contentDialog = false;
    this.loadModules(); // Recargar los modulos para tener el ID y contenido frescos
    this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Contenido guardado exitosamente'});
  }

  private contentError() {
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al añadir contenido'});
  }
}
