import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PurchaseApi {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private headers() {
    const role = localStorage.getItem('role') || 'usuario';
    return new HttpHeaders({ 'x-role': role });
  }

  create(cliente_id: number, pecas: number[]) {
    return this.http.post(`${this.baseUrl}/purchase`, { cliente_id, pecas }, { headers: this.headers() });
  }

  getPendenciasAdmin() {
    return this.http.get(`${this.baseUrl}/pendencies`, { headers: this.headers() });
  }
}
