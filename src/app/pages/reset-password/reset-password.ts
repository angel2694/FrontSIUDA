import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  passwordNueva  = signal('');
  passwordNueva2 = signal('');
  mensaje        = signal('');
  error          = signal('');
  loading        = signal(false);
  listo          = signal(false);

  private uid   = '';
  private token = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.uid   = this.route.snapshot.queryParamMap.get('uid')   ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.uid || !this.token) {
      this.error.set('Enlace invalido o incompleto.');
    }
  }

  confirmar() {
    this.error.set('');
    this.loading.set(true);

    this.authService.confirmarReset(
      this.uid, this.token,
      this.passwordNueva(), this.passwordNueva2()
    )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res: any) => {
          this.listo.set(true);
          this.mensaje.set(res.detail);
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: (err: any) => {
          const msg = err?.error?.detail
            ?? err?.error?.password_nueva2?.[0]
            ?? 'Error al restablecer la contraseña.';
          this.error.set(msg);
        }
      });
  }
}