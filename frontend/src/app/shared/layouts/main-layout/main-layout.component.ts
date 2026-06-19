import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen" style="background: transparent;">
      <!-- Topbar Global -->
      <div class="surface-card px-5 py-4 flex justify-content-between align-items-center sticky top-0 z-5" style="border-bottom: 1px solid rgba(87,87,86,0.1);">
        <div class="flex align-items-center cursor-pointer" routerLink="/dashboard">
          <span class="text-3xl font-serif font-bold text-gray-900" style="letter-spacing: -0.03em;">Soprint <span class="font-sans font-normal text-gray-700">Mentor</span></span>
        </div>
        <div class="hidden lg:flex gap-5 align-items-center text-gray-700 font-medium text-sm">
          <a routerLink="/dashboard" routerLinkActive="text-gray-900 font-bold border-bottom-2" [routerLinkActiveOptions]="{exact: true}" class="no-underline text-gray-600 hover:text-gray-900 transition-colors pb-1" style="border-color: #2a434d !important;">Inicio</a>
          <!-- Las rutas vacías apuntan a dashboard temporalmente para no causar errores -->
          <a routerLink="/dashboard" routerLinkActive="text-gray-900 font-bold border-bottom-2" class="no-underline text-gray-600 hover:text-gray-900 transition-colors pb-1" style="border-color: #2a434d !important;">Cursos</a>
          <a routerLink="/dashboard" routerLinkActive="text-gray-900 font-bold border-bottom-2" class="no-underline text-gray-600 hover:text-gray-900 transition-colors pb-1" style="border-color: #2a434d !important;">Mi Progreso</a>
          <a routerLink="/certificates" routerLinkActive="text-gray-900 font-bold border-bottom-2" class="no-underline text-gray-600 hover:text-gray-900 transition-colors pb-1" style="border-color: #2a434d !important;">Certificaciones</a>
        </div>
        <div class="flex gap-4 align-items-center">
          <i class="pi pi-bell text-xl text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"></i>
          <div class="surface-200 border-circle flex align-items-center justify-content-center cursor-pointer hover:surface-300 transition-colors" style="width: 35px; height: 35px;" (click)="logout()" title="Cerrar sesión">
            <i class="pi pi-user text-gray-700"></i>
          </div>
        </div>
      </div>
      
      <!-- Contenido Dinámico (Páginas) -->
      <router-outlet></router-outlet>
    </div>
  `
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
