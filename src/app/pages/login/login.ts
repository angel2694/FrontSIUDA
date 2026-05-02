import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';

  constructor(private http: HttpClient) {}

  login() {
    const data = {
      username: this.username,
      password: this.password,
    };

    this.http.post('http://127.0.0.1:8000/api/auth/login/', data)
      .subscribe({
        next: (response) => {
          console.log('Login OK:', response);
        },
        error: (error) => {
          console.log('Login error:', error);
        }
      });
  } 
}
