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
  loading = false;

  
  constructor(private authService: AuthService, private router: Router) {}
  
  clearError() {
    this.errorMessage = '';
  }

  login() {
    this.errorMessage = '';
    this.loading = true;
    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.authService.saveToken(response.access);
          console.log('Token guardado');
          this.router.navigate(['/app/dashboard']);
        },
        error: (error: any) => {
          this.loading = false;
          this.errorMessage = 'Credenciales inválidas';
        }
      });
  } 
}
