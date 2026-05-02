import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly APIUrl = 'http://127.0.0.1:8000/api/auth/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    const data = { username, password };
    return this.http.post(`${this.APIUrl}login/`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
  }
}
