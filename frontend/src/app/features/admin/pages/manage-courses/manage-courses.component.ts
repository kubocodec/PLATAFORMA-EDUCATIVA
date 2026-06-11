import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService, Course } from '../../../../core/services/course.service';
import { BrandService, Brand } from '../../../../core/services/brand.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, 
    TableModule, ButtonModule, DialogModule, InputTextModule, 
    InputTextareaModule, DropdownModule, ToastModule, InputSwitchModule
  ],
  providers: [MessageService],
  template: `
    <div class="p-4">
      <p-toast></p-toast>
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="m-0 text-2xl font-semibold">Gestión de Cursos</h2>
        <p-button label="Nuevo Curso" icon="pi pi-plus" (onClick)="openNew()"></p-button>
      </div>

      <div class="glass-panel p-3">
        <p-table [value]="courses" [paginator]="true" [rows]="10" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="title">Título <p-sortIcon field="title"></p-sortIcon></th>
              <th pSortableColumn="brandName">Marca <p-sortIcon field="brandName"></p-sortIcon></th>
              <th pSortableColumn="orderIndex">Orden <p-sortIcon field="orderIndex"></p-sortIcon></th>
              <th pSortableColumn="active">Estado <p-sortIcon field="active"></p-sortIcon></th>
              <th>Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-course>
            <tr>
              <td class="font-bold">{{course.title}}</td>
              <td>{{course.brandName}}</td>
              <td>{{course.orderIndex}}</td>
              <td>
                <span [class]="'p-badge ' + (course.active ? 'p-badge-success' : 'p-badge-danger')">
                  {{course.active ? 'Activo' : 'Inactivo'}}
                </span>
              </td>
              <td>
                <!-- Enlace para gestionar módulos -->
                <p-button icon="pi pi-list" styleClass="p-button-rounded p-button-info mr-2" pTooltip="Gestionar Módulos" (onClick)="manageModules(course)"></p-button>
                <p-button icon="pi pi-pencil" styleClass="p-button-rounded p-button-success mr-2" (onClick)="editCourse(course)"></p-button>
                <p-button icon="pi pi-trash" styleClass="p-button-rounded p-button-danger" (onClick)="deleteCourse(course)"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog [(visible)]="courseDialog" [style]="{width: '500px'}" [header]="isEditing ? 'Editar Curso' : 'Nuevo Curso'" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
          <form [formGroup]="courseForm" class="flex flex-column gap-3 mt-2">
            
            <div class="field">
              <label for="brandId">Marca *</label>
              <p-dropdown id="brandId" [options]="brands" formControlName="brandId" optionLabel="name" optionValue="id" placeholder="Selecciona una marca"></p-dropdown>
              <small class="p-error" *ngIf="courseForm.controls['brandId'].invalid && submitted">La marca es requerida.</small>
            </div>

            <div class="field">
              <label for="title">Título *</label>
              <input type="text" pInputText id="title" formControlName="title" required />
              <small class="p-error" *ngIf="courseForm.controls['title'].invalid && submitted">El título es requerido.</small>
            </div>
            
            <div class="field">
              <label for="description">Descripción</label>
              <textarea id="description" pInputTextarea formControlName="description" rows="3"></textarea>
            </div>

            <div class="flex gap-3">
                <div class="field flex-1">
                  <label for="coverImageUrl">URL de Portada</label>
                  <input type="text" pInputText id="coverImageUrl" formControlName="coverImageUrl" />
                </div>
                <div class="field w-4rem">
                  <label for="orderIndex">Orden</label>
                  <input type="number" pInputText id="orderIndex" formControlName="orderIndex" />
                </div>
            </div>

            <div class="field flex align-items-center justify-content-between mt-2" *ngIf="isEditing">
              <label for="active" class="mb-0">Estado Activo</label>
              <p-inputSwitch id="active" formControlName="active"></p-inputSwitch>
            </div>
          </form>
        </ng-template>

        <ng-template pTemplate="footer">
          <p-button label="Cancelar" icon="pi pi-times" styleClass="p-button-text" (onClick)="hideDialog()"></p-button>
          <p-button label="Guardar" icon="pi pi-check" styleClass="p-button-primary" (onClick)="saveCourse()"></p-button>
        </ng-template>
      </p-dialog>
    </div>
  `
})
export class ManageCoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  private brandService = inject(BrandService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  courses: Course[] = [];
  brands: Brand[] = [];
  courseDialog = false;
  isEditing = false;
  submitted = false;
  currentCourseId?: number;

  courseForm: FormGroup = this.fb.group({
    brandId: [null, Validators.required],
    title: ['', Validators.required],
    description: [''],
    coverImageUrl: [''],
    orderIndex: [0],
    active: [true]
  });

  ngOnInit() {
    this.loadCourses();
    this.loadBrands();
  }

  loadCourses() {
    this.courseService.getAll(false).subscribe({
      next: (data) => this.courses = data,
      error: () => this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar los cursos'})
    });
  }

  loadBrands() {
    this.brandService.getAll(true).subscribe({
      next: (data) => this.brands = data
    });
  }

  openNew() {
    this.courseForm.reset({ active: true, orderIndex: 0 });
    this.isEditing = false;
    this.submitted = false;
    this.courseDialog = true;
  }

  editCourse(course: Course) {
    this.currentCourseId = course.id;
    this.courseForm.patchValue(course);
    this.isEditing = true;
    this.courseDialog = true;
  }

  manageModules(course: Course) {
    this.router.navigate(['/admin/courses', course.id, 'modules']);
  }

  deleteCourse(course: Course) {
    if(confirm(`¿Estás seguro que deseas eliminar el curso ${course.title}?`)) {
      this.courseService.delete(course.id!).subscribe({
        next: () => {
          this.loadCourses();
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Curso eliminado'});
        },
        error: () => this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo eliminar el curso'})
      });
    }
  }

  hideDialog() {
    this.courseDialog = false;
    this.submitted = false;
  }

  saveCourse() {
    this.submitted = true;
    if (this.courseForm.invalid) return;

    const courseData: Course = this.courseForm.value;

    if (this.isEditing && this.currentCourseId) {
      this.courseService.update(this.currentCourseId, courseData).subscribe({
        next: () => {
          this.loadCourses();
          this.hideDialog();
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Curso actualizado'});
        },
        error: () => this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al actualizar'})
      });
    } else {
      this.courseService.create(courseData).subscribe({
        next: () => {
          this.loadCourses();
          this.hideDialog();
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Curso creado'});
        },
        error: () => this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al crear'})
      });
    }
  }
}
