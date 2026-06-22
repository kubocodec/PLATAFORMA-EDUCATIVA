import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModuleService, CourseModule, ModuleContent } from '../../../../core/services/module.service';
import { CourseService, Course } from '../../../../core/services/course.service';
import { environment } from '../../../../../environments/environment';
import { SecureVideoPlayerComponent } from '../../../../shared/components/secure-video-player/secure-video-player.component';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-course-view',
  standalone: true,
  imports: [CommonModule, RouterModule, AccordionModule, ButtonModule, CardModule, SecureVideoPlayerComponent, SafeHtmlPipe],
  template: `
    <div class="flex h-full overflow-hidden" style="background: var(--surface-ground);">
      
      <!-- Sidebar de Navegación del Curso -->
      <div class="w-20rem surface-card shadow-2 flex flex-column h-full">
        <div class="p-3 border-bottom-1 surface-border flex align-items-center">
          <p-button icon="pi pi-arrow-left" styleClass="p-button-text p-button-rounded mr-2" (onClick)="goBack()"></p-button>
          <h3 class="m-0 text-xl font-bold text-truncate" *ngIf="course">{{ course.title }}</h3>
        </div>
        
        <div class="flex-1 overflow-auto p-2">
          <p-accordion [multiple]="true">
            <p-accordionTab *ngFor="let module of modules; let i = index" [header]="(i+1) + '. ' + module.title">
              
              <!-- Videos -->
              <div class="pl-2" *ngIf="module.videos && module.videos.length > 0">
                <div class="text-sm font-bold text-500 mb-2 mt-2 uppercase">Videos</div>
                <div *ngFor="let v of module.videos" 
                     class="flex align-items-center p-2 border-round cursor-pointer hover:surface-hover transition-colors"
                     [class.bg-primary-reverse]="currentContent?.id === v.id && contentType === 'video'"
                     (click)="selectContent(v, 'video', module.type)">
                  <i class="pi pi-play-circle mr-2 text-primary"></i>
                  <span class="text-sm">{{ v.title }}</span>
                </div>
              </div>

              <!-- Textos -->
              <div class="pl-2" *ngIf="module.texts && module.texts.length > 0">
                <div class="text-sm font-bold text-500 mb-2 mt-3 uppercase">Lecturas</div>
                <div *ngFor="let t of module.texts" 
                     class="flex align-items-center p-2 border-round cursor-pointer hover:surface-hover transition-colors"
                     [class.bg-primary-reverse]="currentContent?.id === t.id && contentType === 'text'"
                     (click)="selectContent(t, 'text', module.type)">
                  <i class="pi pi-align-left mr-2 text-primary"></i>
                  <span class="text-sm">{{ t.title }}</span>
                </div>
              </div>

              <!-- Descargas -->
              <div class="pl-2" *ngIf="module.downloads && module.downloads.length > 0">
                <div class="text-sm font-bold text-500 mb-2 mt-3 uppercase">Recursos</div>
                <div *ngFor="let d of module.downloads" 
                     class="flex align-items-center p-2 border-round cursor-pointer hover:surface-hover transition-colors"
                     [class.bg-primary-reverse]="currentContent?.id === d.id && contentType === 'download'"
                     (click)="selectContent(d, 'download', module.type)">
                  <i class="pi pi-download mr-2 text-primary"></i>
                  <span class="text-sm">{{ d.title }}</span>
                </div>
              </div>
            </p-accordionTab>
          </p-accordion>

          <div class="p-3 mt-4 border-top-1 surface-border text-center">
            <p-button label="Realizar Examen" icon="pi pi-check-square" styleClass="p-button-success w-full" (onClick)="goToQuiz()"></p-button>
          </div>
        </div>
      </div>

      <!-- Área de Contenido Principal -->
      <div class="flex-1 flex flex-column h-full overflow-y-auto p-4">
        <div class="max-w-6xl mx-auto w-full">
          
          <div *ngIf="!currentContent" class="text-center py-8 glass-panel border-round-xl">
            <i class="pi pi-video text-6xl text-primary mb-3"></i>
            <h2 class="text-3xl font-bold">Bienvenido al curso</h2>
            <p class="text-xl text-500">Selecciona un tema en el menú lateral para comenzar a aprender.</p>
          </div>

          <div *ngIf="currentContent" class="fadein">
            <h1 class="text-3xl font-bold mb-2">{{ currentContent.title }}</h1>
            <p class="text-600 mb-4 text-lg" *ngIf="currentContent.description">{{ currentContent.description }}</p>

            <!-- Render Video -->
            <div *ngIf="contentType === 'video'" class="mb-5">
              <app-secure-video-player 
                [videoUrl]="getVideoUrl(currentContent)" 
                [isLocalFile]="currentContent.isLocalFile!">
              </app-secure-video-player>
            </div>

            <!-- Render Text -->
            <div *ngIf="contentType === 'text'" class="glass-panel p-5 border-round-xl line-height-4 text-lg ql-snow">
              <div class="ql-editor" [innerHTML]="currentContent.content | safeHtml"></div>
            </div>

            <!-- Render Download -->
            <div *ngIf="contentType === 'download'">

              <!-- Vista previa PDF -->
              <div *ngIf="filePreviewType === 'pdf'" class="border-round-xl overflow-hidden shadow-2" style="height: 80vh;">
                <iframe [src]="safeFileUrl" class="w-full h-full" style="border: none;"></iframe>
              </div>

              <!-- Vista previa Imagen -->
              <div *ngIf="filePreviewType === 'image'" class="text-center">
                <img [src]="fileUrl" [alt]="currentContent?.title" class="border-round-xl shadow-2" style="max-width: 100%; max-height: 80vh; object-fit: contain;" />
              </div>

              <!-- Archivo no visualizable: solo descarga -->
              <div *ngIf="filePreviewType === 'other'" class="glass-panel p-5 border-round-xl text-center">
                <i class="pi pi-file text-8xl text-primary mb-4"></i>
                <h3 class="text-2xl mb-4">Recurso Descargable</h3>
                <p-button label="Descargar Archivo" icon="pi pi-download" size="large" (onClick)="downloadFile()"></p-button>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  `
})
export class CourseViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private moduleService = inject(ModuleService);
  private courseService = inject(CourseService);
  private sanitizer = inject(DomSanitizer);

  courseId!: number;
  course: Course | null = null;
  modules: CourseModule[] = [];

  currentContent: ModuleContent | null = null;
  contentType: 'video' | 'text' | 'download' | null = null;

  filePreviewType: 'pdf' | 'image' | 'other' = 'other';
  fileUrl = '';
  safeFileUrl: SafeResourceUrl | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      if (this.courseId) {
        this.loadCourseData();
      }
    });
  }

  loadCourseData() {
    this.courseService.getById(this.courseId).subscribe(data => this.course = data);
    this.moduleService.getByCourse(this.courseId).subscribe(data => {
      this.modules = data.filter(m => m.type !== 'QUIZ');
      // Autoseleccionar el primer contenido del primer modulo
      if (this.modules.length > 0) {
        const firstMod = this.modules[0];
        if (firstMod.videos && firstMod.videos.length > 0) this.selectContent(firstMod.videos[0], 'video', firstMod.type);
        else if (firstMod.texts && firstMod.texts.length > 0) this.selectContent(firstMod.texts[0], 'text', firstMod.type);
      }
    });
  }

  selectContent(content: ModuleContent, type: 'video' | 'text' | 'download', moduleType: string) {
    this.currentContent = content;
    this.contentType = type;
    if (type === 'download') {
      this.resolveFilePreview(content);
    }
  }

  private resolveFilePreview(content: ModuleContent) {
    const rawUrl = content.url || '';
    let fullUrl = content.isLocalFile
      ? environment.apiUrl.replace('/api', '') + rawUrl
      : rawUrl;

    // Si la página corre en HTTPS y la URL guardada es HTTP, corregir el protocolo
    if (window.location.protocol === 'https:' && fullUrl.startsWith('http:')) {
      fullUrl = fullUrl.replace('http:', 'https:');
    }

    this.fileUrl = fullUrl;

    const lower = rawUrl.toLowerCase();
    if (lower.includes('.pdf')) {
      this.filePreviewType = 'pdf';
      this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    } else if (/\.(jpg|jpeg|png|gif|webp|svg)/.test(lower)) {
      this.filePreviewType = 'image';
      this.safeFileUrl = null;
    } else {
      this.filePreviewType = 'other';
      this.safeFileUrl = null;
    }
  }

  getVideoUrl(content: ModuleContent): string {
    if (content.isLocalFile) {
      return environment.apiUrl.replace('/api', '') + content.videoUrl;
    }
    return content.videoUrl || '';
  }

  downloadFile() {
    if (!this.currentContent?.url) return;

    let fullUrl = this.currentContent.url;
    if (this.currentContent.isLocalFile) {
      fullUrl = environment.apiUrl.replace('/api', '') + this.currentContent.url;
    }
    if (window.location.protocol === 'https:' && fullUrl.startsWith('http:')) {
      fullUrl = fullUrl.replace('http:', 'https:');
    }
    window.open(fullUrl, '_blank');
  }

  goBack() {
    if (this.course) {
      this.router.navigate(['/brand', this.course.brandId, 'courses']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  goToQuiz() {
    this.router.navigate(['/take-quiz', this.courseId]);
  }
}
