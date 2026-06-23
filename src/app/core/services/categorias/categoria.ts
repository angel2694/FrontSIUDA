import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/categorias/`;

  constructor(private http: HttpClient) {}

  getCategorias() {
    return this.http.get(this.apiUrl);
  }

  getCategoria(id: number) {
    return this.http.get(`${this.apiUrl}${id}/`);
  }

  createCategoria(categoria: any) {
    return this.http.post(this.apiUrl, categoria);
  }

  updateCategoria(id: number, categoria: any) {
    return this.http.put(`${this.apiUrl}${id}/`, categoria);
  }

  deleteCategoria(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
