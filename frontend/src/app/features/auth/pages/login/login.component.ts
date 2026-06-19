import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule],
  template: `
    <div class="login-container flex align-items-center justify-content-center min-h-screen">
      
      <div class="glass-panel p-5 w-full md:w-4 lg:w-3 flex flex-column align-items-center">
        <div class="text-center mb-5">
          <i class="pi pi-graduation-cap text-6xl mb-3" style="color: #AB1919;"></i>
          <h1 class="text-3xl font-bold m-0">Soprint Mentor</h1>
          <p class="text-gray-600 mt-2">Plataforma de Capacitación Continua</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="w-full flex flex-column gap-4">
          <div class="flex flex-column gap-2">
            <label htmlFor="email" class="font-medium text-sm" style="color: #575756;">Correo Electrónico</label>
            <input pInputText id="email" type="email" formControlName="email" placeholder="usuario@empresa.com" class="w-full" />
          </div>

          <div class="flex flex-column gap-2">
            <label htmlFor="password" class="font-medium text-sm" style="color: #575756;">Contraseña</label>
            <p-password id="password" formControlName="password" [toggleMask]="true" [feedback]="false" styleClass="w-full" inputStyleClass="w-full" placeholder="••••••••"></p-password>
          </div>

          <div class="flex align-items-center justify-content-between text-sm mt-2 mb-3">
            <a href="#" class="no-underline transition-colors hover:underline" style="color: #AB1919;">¿Olvidaste tu contraseña?</a>
          </div>

          <p-button label="Ingresar" type="submit" [disabled]="loginForm.invalid || loading" [loading]="loading" styleClass="w-full p-button-primary mb-3"></p-button>
          
          <div class="text-center text-sm" style="color: #575756;">
            ¿No tienes cuenta? <a href="/register" class="no-underline font-medium hover:underline" style="color: #AB1919;">Regístrate aquí</a>
          </div>
        </form>
      </div>

    </div>
  `,
  styles: [`
    .login-container {
      background-image: url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80');
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .login-container::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255, 255, 255, 0.4); /* Light overlay */
      backdrop-filter: blur(2px);
      z-index: 0;
    }
    .glass-panel {
      position: relative;
      z-index: 1;
    }
    ::ng-deep .p-password-input {
      width: 100%;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          // Mostrar mensaje de error (usar MessageService de PrimeNG en el futuro)
        }
      });
    }
  }
}
