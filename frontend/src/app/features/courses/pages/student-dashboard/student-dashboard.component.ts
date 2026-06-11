import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BrandService, Brand } from '../../../../core/services/brand.service';
import { AuthService } from '../../../../core/services/auth.service';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  template: `
    <div class="min-h-screen" style="background: var(--surface-ground);">
      <!-- Topbar -->
      <div class="surface-card shadow-2 px-4 py-3 flex justify-content-between align-items-center sticky top-0 z-5">
        <div class="flex align-items-center">
          <i class="pi pi-graduation-cap text-3xl text-primary mr-2" style="background: linear-gradient(90deg, #2979ff, #00e5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"></i>
          <span class="text-2xl font-bold">Capacita<span class="text-primary">Pro</span></span>
        </div>
        <div class="flex gap-3 align-items-center">
          <p-button label="Mis Certificados" icon="pi pi-file-pdf" styleClass="p-button-text p-button-info" routerLink="/certificates"></p-button>
          <p-button *ngIf="isAdmin" label="Panel Admin" icon="pi pi-cog" styleClass="p-button-text p-button-warning" routerLink="/admin"></p-button>
          <p-button icon="pi pi-sign-out" styleClass="p-button-rounded p-button-secondary p-button-text" (onClick)="logout()" pTooltip="Cerrar sesión"></p-button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="p-5 max-w-7xl mx-auto">
        <div class="text-center mb-6">
          <h1 class="text-5xl font-bold mb-3">Bienvenido a tu centro de capacitación</h1>
          <p class="text-xl text-500">Selecciona una marca para explorar sus cursos y certificaciones oficiales.</p>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6 lg:col-4" *ngFor="let brand of brands">
            <p-card styleClass="shadow-4 border-round-2xl overflow-hidden cursor-pointer transition-transform transition-duration-200 hover:-translate-y-2 h-full flex flex-column" (click)="goToCatalog(brand.id!)">
              <ng-template pTemplate="header">
                <div class="h-10rem bg-primary flex align-items-center justify-content-center border-round-top-2xl p-3" style="background: linear-gradient(135deg, var(--surface-800), var(--surface-900));">
                  <img *ngIf="brand.logoUrl" [src]="brand.logoUrl" [alt]="brand.name" class="max-h-full max-w-full" />
                  <i *ngIf="!brand.logoUrl" class="pi pi-briefcase text-6xl text-white"></i>
                </div>
              </ng-template>
              <div class="flex-1 text-center">
                <h2 class="text-2xl font-bold m-0 mb-2">{{ brand.name }}</h2>
                <p class="text-500 m-0">{{ brand.description || 'Explora los cursos oficiales de ' + brand.name }}</p>
              </div>
              <ng-template pTemplate="footer">
                <p-button label="Ver Cursos" icon="pi pi-arrow-right" iconPos="right" styleClass="w-full p-button-outlined"></p-button>
              </ng-template>
            </p-card>
          </div>
        </div>

        <div class="text-center mt-8 py-5 border-round-2xl surface-card shadow-2" *ngIf="brands.length === 0">
          <i class="pi pi-box text-6xl text-400 mb-3"></i>
          <h2>No hay marcas disponibles</h2>
          <p class="text-500">El administrador aún no ha publicado ninguna marca.</p>
        </div>
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  private brandService = inject(BrandService);
  private authService = inject(AuthService);
  private router = inject(Router);

  brands: Brand[] = [];
  isAdmin = false;

  ngOnInit() {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'ADMIN';

    this.brandService.getAll(true).subscribe({
      next: (data) => this.brands = data
    });
  }

  goToCatalog(brandId: number) {
    this.router.navigate(['/brand', brandId, 'courses']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
