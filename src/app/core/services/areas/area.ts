import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private readonly APIUrl = `${environment.apiUrl}/areas/`;

  constructor(private http: HttpClient) {}

  getAreas() {
    return this.http.get<any[]>(this.APIUrl);
  }

  getArea(id: number) {
    return this.http.get<any>(`${this.APIUrl}${id}/`);
  }

  createArea(area: any) {
    return this.http.post(this.APIUrl, area);
  }

  updateArea(id: number, area: any) {
    return this.http.put(`${this.APIUrl}${id}/`, area);
  }

  deleteArea(id: number) {
    return this.http.delete(`${this.APIUrl}${id}/`);
  }
}
