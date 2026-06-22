import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService, Course } from '../../../../core/services/course.service';
import { BrandService, Brand } from '../../../../core/services/brand.service';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  template: `
    <div class="min-h-screen" style="background: var(--surface-ground);">
      <!-- Topbar Simple -->
      <div class="surface-card px-4 py-3 flex align-items-center sticky top-0" style="z-index: 100; border-bottom: 1px solid rgba(0,0,0,0.08);">
        <p-button icon="pi pi-arrow-left" label="Volver a Marcas" styleClass="p-button-text mr-4" routerLink="/dashboard"></p-button>
        <span class="text-xl font-bold" *ngIf="brand">{{ brand.name }} - Cursos Oficiales</span>
      </div>

      <div class="p-5 max-w-7xl mx-auto">
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-4" *ngFor="let course of courses">
            <p-card styleClass="shadow-4 border-round-xl h-full flex flex-column">
              <ng-template pTemplate="header">
                <div class="h-12rem bg-cover bg-center border-round-top-xl relative" [style.background-image]="course.coverImageUrl ? 'url(' + course.coverImageUrl + ')' : 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80)'">
                  <div class="absolute bottom-0 left-0 w-full p-3" style="background: linear-gradient(transparent, rgba(0,0,0,0.8));">
                    <h3 class="text-white m-0 text-xl">{{ course.title }}</h3>
                  </div>
                </div>
              </ng-template>
              
              <div class="flex-1">
                <p class="text-600 m-0 line-height-3">{{ course.description || 'Sin descripción disponible.' }}</p>
              </div>

              <ng-template pTemplate="footer">
                <div class="flex justify-content-end">
                  <p-button label="Iniciar Curso" icon="pi pi-play" (onClick)="startCourse(course.id!)" styleClass="w-full"></p-button>
                </div>
              </ng-template>
            </p-card>
          </div>
        </div>

        <div class="text-center mt-8 py-5" *ngIf="courses.length === 0">
          <i class="pi pi-folder-open text-6xl text-400 mb-3"></i>
          <h2>Aún no hay cursos</h2>
          <p class="text-500">Esta marca no tiene cursos publicados por el momento.</p>
        </div>
      </div>
    </div>
  `
})
export class CourseCatalogComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private brandService = inject(BrandService);

  brandId!: number;
  brand: Brand | null = null;
  courses: Course[] = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.brandId = +params['brandId'];
      if (this.brandId) {
        this.loadBrandAndCourses();
      }
    });
  }

  loadBrandAndCourses() {
    this.brandService.getById(this.brandId).subscribe(data => this.brand = data);
    this.courseService.getByBrand(this.brandId).subscribe(data => this.courses = data);
  }

  startCourse(courseId: number) {
    this.router.navigate(['/course', courseId, 'view']);
  }
}
