import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {

  private readonly APIUrl = `${environment.apiUrl}/proveedores/`;

  constructor(private http: HttpClient) {}

  getProveedores() {
    return this.http.get<any[]>(this.APIUrl);
  }

  getProveedor(id: number) {
    return this.http.get<any>(`${this.APIUrl}${id}/`);
  }

  createProveedor(data: any) {
    return this.http.post(this.APIUrl, data);
  }

  updateProveedor(id: number, data: any) {
    return this.http.put(`${this.APIUrl}${id}/`, data);
  }
  
  deleteProveedor(id: number) {
    return this.http.delete(`${this.APIUrl}${id}/`);
  }
}
