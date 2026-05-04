import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = signal('');
  password = signal('');
  errorMessage = signal('');
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  clearError() {
    this.errorMessage.set('');
  }

  login() {
    this.errorMessage.set('');
    this.loading.set(true);

    this.authService.login(this.username(), this.password())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response: any) => {
          this.authService.saveToken(response.access);
          this.router.navigate(['/app/dashboard']);
        },
        error: (error: any) => {
          const msg = error?.error?.detail
            ?? error?.error?.non_field_errors?.[0]
            ?? 'Credenciales inválidas';
          this.errorMessage.set(msg);
        }
      });
  }
}