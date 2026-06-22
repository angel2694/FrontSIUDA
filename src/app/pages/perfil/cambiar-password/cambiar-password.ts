import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-cambiar-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-password.html',
  styleUrl: './cambiar-password.css',
})
export class CambiarPassword {
  passwordActual = signal('');
  passwordNueva = signal('');
  passwordNueva2 = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  loading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  cambiar() {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.loading.set(true);

    this.authService.cambiarPassword(this.passwordActual(), this.passwordNueva(), this.passwordNueva2())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.successMessage.set('Contraseña actualizada. Volviendo al perfil...');
          setTimeout(() => this.router.navigate(['/app/perfil']), 1500);
        },
        error: (error: any) => {
          const err = error?.error;
          const msg = err?.detail ?? err?.password_nueva2?.[0] ?? 'Error al cambiar contraseña';
          this.errorMessage.set(msg);
        }
      });
  }

  volver() {
    this.router.navigate(['/app/perfil']);
  }
}