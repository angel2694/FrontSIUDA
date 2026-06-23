import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProformaService {
  private readonly APIUrl = `${environment.apiUrl}/proformas/`;

  constructor(private http: HttpClient) {}

  getProformas() {
    return this.http.get<any[]>(this.APIUrl);
  }

  getProforma(id: number) {
    return this.http.get<any>(`${this.APIUrl}${id}/`);
  }

  createProforma(data: any) {
    return this.http.post(this.APIUrl, data);
  }

  updateProforma(id: number, data: any) {
    return this.http.put(`${this.APIUrl}${id}/`, data);
  }

  deleteProforma(id: number) {
    return this.http.delete(`${this.APIUrl}${id}/`);
  }
}