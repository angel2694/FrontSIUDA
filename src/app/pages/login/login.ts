import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response: any) => {
          this.authService.saveToken(response.access);
          console.log('Token guardado');
          this.router.navigate(['/app/dashboard']);
        },
        error: (error: any) => {
          console.log('Error', error);
        }
      });
  } 
}
