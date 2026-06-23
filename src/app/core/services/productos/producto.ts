import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {

  private apiUrl = `${environment.apiUrl}/productos/`;

  constructor(private http: HttpClient) {}

  getProductos() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProducto(id: number) {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  createProducto(producto: any) {
    return this.http.post(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: any) {
    return this.http.put(`${this.apiUrl}${id}/`, producto);
  }

  deleteProducto(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

}
