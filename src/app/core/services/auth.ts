import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modulo } from '../interfaces/modulo';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly APIUrl = `${environment.apiUrl}/auth/`;
  
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
    localStorage.removeItem('refresh_token');
  }

  register(username: string, email: string, password: string, password2: string) {
    return this.http.post(`${this.APIUrl}register/`, { username, email, password, password2 });
  }

  getModulos(): Modulo[] {
    const token = this.getToken();
    if (!token) return [];
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.modulos ?? [];
  }

  saveModulos(modulos: Modulo[]) {
    localStorage.setItem('modulos', JSON.stringify(modulos));
  }

  getPerfil() {
    return this.http.get(`${this.APIUrl}profile/`);
  }

  cambiarPassword(password_actual: string, password_nueva: string, password_nueva2: string) {
    return this.http.patch(`${this.APIUrl}profile/password/`, { password_actual, password_nueva, password_nueva2 });
  }

  solicitarReset(email: string) {
    return this.http.post(`${this.APIUrl}password-reset/`, { email });
  }

  confirmarReset(uid: string, token: string, password_nueva: string, password_nueva2: string) {
    return this.http.post(`${this.APIUrl}password-reset/confirm/`, {
      uid, token, password_nueva, password_nueva2
    });
  }

  saveRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token);
  }
  
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  refreshToken() {
    return this.http.post(`${environment.apiUrl}/token/refresh/`, {
      refresh: this.getRefreshToken()
    });
}
}
