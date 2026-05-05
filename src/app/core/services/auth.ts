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

  getUsuarios() {
    return this.http.get<any[]>(`${this.APIUrl}users/`);
  }

  assignRole(id: number, role: string) {
    return this.http.patch(`${this.APIUrl}users/${id}/role/`, { role });
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  saveRole(role: string) {
    localStorage.setItem('role', role);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
  }
}
