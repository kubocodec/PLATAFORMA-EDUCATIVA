import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-column" style="height: 100vh; overflow: hidden; background: transparent;">
      <!-- Topbar Global -->
      <div class="surface-card px-5 py-4 flex justify-content-between align-items-center flex-shrink-0" style="z-index: 1000; border-bottom: 1px solid rgba(87,87,86,0.1);">
        <div class="flex align-items-center cursor-pointer" routerLink="/dashboard">
          <span class="text-3xl font-serif font-bold text-gray-900" style="letter-spacing: -0.03em;">Soprint<sup style="font-size: 0.45em; vertical-align: super;">®</sup> <span class="font-sans font-normal text-gray-700">Mentor</span></span>
        </div>
        <div class="hidden lg:flex gap-5 align-items-center text-gray-700 font-medium text-sm">
          <a routerLink="/dashboard" routerLinkActive="text-gray-900 font-bold border-bottom-2" [routerLinkActiveOptions]="{exact: true}" class="no-underline text-gray-600 hover:text-gray-900 transition-colors pb-1" style="border-color: #2a434d !important;">Inicio</a>
          <a routerLink="/dashboard" routerLinkActive="text-gray-900 font-bold border-bottom-2" class="no-underline text-gray-600 hover:text-gray-900 transition-colors pb-1" style="border-color: #2a434d !important;">Cursos</a>
          <a routerLink="/dashboard" routerLinkActive="text-gray-900 font-bold border-bottom-2" class="no-underline text-gray-600 hover:text-gray-900 transition-colors pb-1" style="border-color: #2a434d !important;">Mi Progreso</a>
          <a routerLink="/certificates" routerLinkActive="text-gray-900 font-bold border-bottom-2" class="no-underline text-gray-600 hover:text-gray-900 transition-colors pb-1" style="border-color: #2a434d !important;">Certificaciones</a>
          <a *ngIf="isAdmin" routerLink="/admin" class="no-underline font-semibold px-3 py-2 border-round-lg transition-colors" style="background-color: #2a434d; color: #fff;">
            <i class="pi pi-shield mr-1"></i>Admin
          </a>
        </div>
        <div class="flex gap-4 align-items-center">
          <i class="pi pi-bell text-xl text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"></i>
          <div class="surface-200 border-circle flex align-items-center justify-content-center cursor-pointer hover:surface-300 transition-colors" style="width: 35px; height: 35px;" (click)="logout()" title="Cerrar sesión">
            <i class="pi pi-user text-gray-700"></i>
          </div>
        </div>
      </div>
      
      <!-- Contenido Dinámico (Páginas) -->
      <div style="flex: 1; overflow-y: auto; overflow-x: hidden;">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class MainLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: AuthResponse | null = null;
  isAdmin = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
