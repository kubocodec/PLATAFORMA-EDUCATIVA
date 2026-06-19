import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule],
  template: `
    <div class="login-container flex align-items-center justify-content-center min-h-screen">
      <div class="glass-panel p-5 w-full md:w-5 lg:w-4 flex flex-column align-items-center">
        <div class="text-center mb-5">
          <i class="pi pi-user-plus text-5xl mb-3" style="color: #AB1919;"></i>
          <h1 class="text-3xl font-bold m-0">Crear Cuenta</h1>
          <p class="text-gray-600 mt-2">Únete a Soprint Mentor</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="w-full flex flex-column gap-4">
          <div class="flex flex-column gap-2">
            <label htmlFor="fullName" class="font-medium text-sm" style="color: #575756;">Nombre Completo</label>
            <input pInputText id="fullName" type="text" formControlName="fullName" placeholder="Ej. Juan Pérez" class="w-full" />
          </div>

          <div class="flex flex-column gap-2">
            <label htmlFor="email" class="font-medium text-sm" style="color: #575756;">Correo Electrónico</label>
            <input pInputText id="email" type="email" formControlName="email" placeholder="usuario@empresa.com" class="w-full" />
          </div>

          <div class="flex flex-column gap-2">
            <label htmlFor="password" class="font-medium text-sm" style="color: #575756;">Contraseña</label>
            <p-password id="password" formControlName="password" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full" placeholder="Mínimo 6 caracteres"></p-password>
          </div>

          <p-button label="Registrarse" type="submit" [disabled]="registerForm.invalid || loading" [loading]="loading" styleClass="w-full p-button-primary mt-3 mb-3"></p-button>
          
          <div class="text-center text-sm" style="color: #575756;">
            ¿Ya tienes cuenta? <a href="/login" class="no-underline font-medium hover:underline" style="color: #AB1919;">Inicia sesión</a>
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
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(2px);
      z-index: 0;
    }
    .glass-panel { position: relative; z-index: 1; }
    ::ng-deep .p-password-input { width: 100%; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
}
