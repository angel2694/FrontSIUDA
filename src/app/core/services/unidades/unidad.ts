import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UnidadService {
  private apiUrl = `${environment.apiUrl}/unidades/`;

  constructor(private http: HttpClient) {}
  
  getUnidades() {
    return this.http.get<any[]>(this.apiUrl);
  }
  
  getUnidad(id: number) {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }
  
  createUnidad(data: any) {
    return this.http.post(this.apiUrl, data);
  }
  
  updateUnidad(id: number, data: any) {
    return this.http.put(`${this.apiUrl}${id}/`, data);
  }
  
  deleteUnidad(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
