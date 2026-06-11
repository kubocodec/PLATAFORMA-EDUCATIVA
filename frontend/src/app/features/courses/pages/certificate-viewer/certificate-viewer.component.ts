import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateService, Certificate } from '../../../../core/services/certificate.service';
import { environment } from '../../../../../environments/environment';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-certificate-viewer',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="p-4" style="background: var(--surface-ground); min-height: 100vh;">
      <p-toast></p-toast>
      <div class="flex justify-content-between align-items-center mb-5">
        <h1 class="text-3xl font-bold m-0"><i class="pi pi-trophy text-yellow-500 mr-2 text-4xl"></i> Mis Certificados</h1>
        <p-button icon="pi pi-arrow-left" label="Volver" styleClass="p-button-outlined" routerLink="/dashboard"></p-button>
      </div>

      <div class="grid" *ngIf="certificates.length > 0">
        <div class="col-12 md:col-6 lg:col-4" *ngFor="let cert of certificates">
          <p-card styleClass="shadow-4 border-round-xl h-full flex flex-column transition-transform transition-duration-200 hover:-translate-y-1">
            <ng-template pTemplate="header">
              <div class="bg-primary border-round-top-xl p-4 text-center">
                <i class="pi pi-file-pdf text-6xl text-white"></i>
              </div>
            </ng-template>
            <div class="text-center">
              <h3 class="text-xl font-bold mb-2">{{ cert.courseName }}</h3>
              <p class="text-500 mb-0">Emitido el: {{ cert.issuedAt | date:'longDate' }}</p>
            </div>
            <ng-template pTemplate="footer">
              <p-button label="Descargar PDF" icon="pi pi-download" styleClass="w-full p-button-success" (onClick)="downloadCertificate(cert)"></p-button>
            </ng-template>
          </p-card>
        </div>
      </div>

      <div class="text-center py-8 glass-panel" *ngIf="certificates.length === 0 && !loading">
        <i class="pi pi-inbox text-6xl text-400 mb-3"></i>
        <h2 class="text-2xl font-medium text-700">Aún no tienes certificados</h2>
        <p class="text-500 mb-4">Completa los cursos y aprueba los cuestionarios para obtenerlos.</p>
        <p-button label="Ir a Cursos" routerLink="/dashboard"></p-button>
      </div>
    </div>
  `
})
export class CertificateViewerComponent implements OnInit {
  private certificateService = inject(CertificateService);
  private messageService = inject(MessageService);

  certificates: Certificate[] = [];
  loading = true;

  ngOnInit() {
    this.certificateService.getMyCertificates().subscribe({
      next: (data) => {
        this.certificates = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los certificados'});
        this.loading = false;
      }
    });
  }

  downloadCertificate(cert: Certificate) {
    // Redirigir a la URL del backend donde se sirve el archivo (usualmente requiere auth si está protegido)
    // Asumiendo que el archivo está estático o la URL genera la descarga directamente:
    const fullUrl = environment.apiUrl.replace('/api', '') + cert.pdfUrl; // baseUrl + /api/files/download/xxx.pdf
    window.open(fullUrl, '_blank');
  }
}
