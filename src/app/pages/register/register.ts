import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  username = signal('');
  email = signal('');
  password = signal('');
  password2 = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.loading.set(true);

    this.authService.register(this.username(), this.email(), this.password(), this.password2())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Usuario registrado. Redirigiendo...');
          setTimeout(() => this.router.navigate(['/app/usuarios']), 1500);
        },
        error: (error: any) => {
          const errors = error?.error;
          const msg = errors?.username?.[0]
            ?? errors?.email?.[0]
            ?? errors?.password?.[0]
            ?? errors?.password2?.[0]
            ?? errors?.detail
            ?? 'Error al registrar usuario';
          this.errorMessage.set(msg);
        }
      });
  }
}