import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  email        = signal('');
  mensaje      = signal('');
  error        = signal('');
  loading      = signal(false);
  enviado      = signal(false);

  constructor(private authService: AuthService) {}

  enviar() {
    this.error.set('');
    this.mensaje.set('');
    this.loading.set(true);

    this.authService.solicitarReset(this.email())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.enviado.set(true);
          this.mensaje.set(res.detail);
        },
        error: (err: any) => {
          this.error.set(err?.error?.email?.[0] ?? 'Ocurrio un error, intenta de nuevo.');
        }
      });
  }
}