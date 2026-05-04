import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = '';
    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response: any) => {
          this.authService.saveToken(response.access);
          console.log('Token guardado');
          this.router.navigate(['/app/dashboard']);
        },
        error: (error: any) => {
          console.log('Error', error);
          if (error.status === 401) {
            this.errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = 'Error al iniciar sesión. Por favor, inténtalo más tarde.';

          }
        }
      });
  } 
}
