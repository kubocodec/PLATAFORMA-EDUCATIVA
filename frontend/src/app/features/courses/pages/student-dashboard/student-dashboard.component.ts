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
    <div style="background: transparent;">
      <!-- Hero Section -->
      <div class="hero-section px-5 flex flex-column justify-content-center">
        <div class="max-w-7xl mx-auto w-full mt-4">
          <h1 class="text-8xl font-serif text-gray-900 m-0" style="letter-spacing: -0.04em;">Soprint <span class="font-sans font-light text-gray-500" style="letter-spacing: -0.05em;">Mentor</span></h1>
          <p class="text-sm font-semibold text-gray-600 mt-3 tracking-widest uppercase" style="letter-spacing: 0.05em;">Plataforma de Capacitación y Formación</p>
        </div>
      </div>

      <!-- Overlapping Category Cards -->
      <div class="overlapping-cards max-w-7xl mx-auto px-5 mb-7">
        <div class="grid gap-4 m-0">
          <div class="col-12 md:col-6 lg:col-3 p-0" *ngFor="let brand of brands">
            <div class="editorial-card surface-card p-4 border-round-2xl cursor-pointer transition-transform transition-duration-200 hover:-translate-y-2 h-full flex flex-column justify-content-between" style="box-shadow: 0 12px 40px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.05);" (click)="goToCatalog(brand.id!)">
              <div>
                <div class="surface-100 border-round-xl flex align-items-center justify-content-center mb-4" style="width: 50px; height: 50px;">
                  <i *ngIf="!brand.logoUrl" class="pi pi-cog text-xl text-gray-700"></i>
                  <img *ngIf="brand.logoUrl" [src]="brand.logoUrl" [alt]="brand.name" class="max-w-full max-h-full p-2" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 m-0 mb-3 line-height-2" style="letter-spacing: -0.02em;">{{ brand.name }}</h2>
              </div>
              <button pButton label="Explorar Cursos" class="p-button-outlined w-full border-round-lg mt-4 font-semibold hover:surface-700 transition-colors" style="color: #f8f9fa; background-color: #2a434d; border-color: #2a434d; padding: 0.75rem;"></button>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-5 py-5 border-round-2xl surface-card shadow-2" *ngIf="brands.length === 0">
          <i class="pi pi-box text-6xl text-400 mb-3"></i>
          <h2>No hay marcas disponibles</h2>
          <p class="text-500">El administrador aún no ha publicado ninguna marca.</p>
        </div>
      </div>

      <!-- Static Welcome Section -->
      <div class="max-w-7xl mx-auto px-5 pb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4" style="letter-spacing: -0.02em;">Bienvenido, Usuario</h2>
        <div class="grid gap-4 m-0">
          <!-- Card 1: Ultimo Curso -->
          <div class="col-12 md:col-6 lg:col-5 p-0">
            <div class="surface-card p-4 border-round-2xl flex align-items-center h-full" style="box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.05);">
              <div class="surface-200 border-round-lg mr-4 overflow-hidden" style="width: 80px; height: 80px; min-width: 80px;">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=150" alt="Course" class="w-full h-full" style="object-fit: cover;" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-500 m-0 mb-1">Tu último curso:</p>
                <div class="flex justify-content-between align-items-start mb-3">
                    <h3 class="text-lg font-bold text-gray-900 m-0">Introducción a la Línea X</h3>
                    <i class="pi pi-ellipsis-v text-gray-400 cursor-pointer"></i>
                </div>
                <div class="flex align-items-center w-full">
                  <div class="surface-200 border-round-xl w-full h-1rem overflow-hidden mr-3">
                    <div class="h-full border-round-xl" style="width: 100%; background-color: #2a434d;"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-700">100%</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Card 2: Formacion de clientes -->
          <div class="col-12 md:col-6 lg:col-5 p-0">
            <div class="surface-card p-4 border-round-2xl flex flex-column justify-content-center h-full" style="box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.05);">
               <div class="flex justify-content-between align-items-center mb-4">
                 <h3 class="text-lg font-bold text-gray-900 m-0">Formación de Clientes</h3>
                 <i class="pi pi-angle-right text-gray-500 cursor-pointer text-xl"></i>
               </div>
               <div class="flex gap-6">
                 <div>
                   <p class="text-sm text-gray-500 m-0 mb-1">Progreso</p>
                   <p class="font-bold text-gray-900 m-0">Sobresaliente</p>
                 </div>
                 <div>
                   <p class="text-sm text-gray-500 m-0 mb-1">Duración</p>
                   <p class="font-bold text-gray-900 m-0">24 horas</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  private brandService = inject(BrandService);
  private router = inject(Router);

  brands: Brand[] = [];

  ngOnInit() {
    this.brandService.getAll(true).subscribe({
      next: (data) => this.brands = data
    });
  }

  goToCatalog(brandId: number) {
    this.router.navigate(['/brand', brandId, 'courses']);
  }
}
