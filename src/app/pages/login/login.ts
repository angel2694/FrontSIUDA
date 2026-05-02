import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.username, this.password)
      .subscribe({
        next: (response: any) => {
          this.authService.saveToken(response.access);
          console.log('Token guardado');
        },
        error: (error: any) => {
          console.log('Error', error);
        }
      });
  } 
}
