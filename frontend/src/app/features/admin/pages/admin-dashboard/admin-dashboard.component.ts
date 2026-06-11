import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, RippleModule],
  template: `
    <div class="flex min-h-screen surface-ground">
      <!-- Sidebar -->
      <div class="w-16rem surface-card shadow-2 hidden md:block">
        <div class="p-4 flex align-items-center justify-content-center border-bottom-1 surface-border">
          <i class="pi pi-shield text-primary text-3xl mr-2"></i>
          <span class="text-xl font-bold">Admin Panel</span>
        </div>
        <div class="p-3">
          <ul class="list-none p-0 m-0">
            <li>
              <a routerLink="brands" routerLinkActive="surface-hover text-primary font-bold" class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-hover transition-duration-150 transition-colors w-full no-underline">
                <i class="pi pi-tags mr-2"></i>
                <span class="font-medium">Marcas</span>
              </a>
            </li>
            <li>
              <a routerLink="courses" routerLinkActive="surface-hover text-primary font-bold" class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-hover transition-duration-150 transition-colors w-full no-underline">
                <i class="pi pi-book mr-2"></i>
                <span class="font-medium">Cursos</span>
              </a>
            </li>

            <li>
              <hr class="my-3 border-top-1 border-none surface-border" />
            </li>
            <li>
              <a routerLink="/dashboard" class="flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-hover transition-duration-150 transition-colors w-full no-underline">
                <i class="pi pi-home mr-2"></i>
                <span class="font-medium">Volver al Sitio</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 flex flex-column">
        <!-- Topbar -->
        <div class="surface-card shadow-1 p-3 flex justify-content-between align-items-center">
          <p-button icon="pi pi-bars" styleClass="p-button-text md:hidden"></p-button>
          <div class="flex align-items-center gap-3 ml-auto">
            <span class="font-medium">Administrador</span>
            <div class="w-2rem h-2rem bg-primary border-circle flex align-items-center justify-content-center">
              <i class="pi pi-user text-white"></i>
            </div>
          </div>
        </div>

        <!-- Router Outlet -->
        <div class="p-4 flex-1 overflow-auto">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {}
