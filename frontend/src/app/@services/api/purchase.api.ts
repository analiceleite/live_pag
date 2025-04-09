import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  getPendenciasAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pendencies`, { headers: this.headers() });
  }

  getPendenciasCliente(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pendencies-by-client/${clienteId}`, { headers: this.headers() });
  }

  markAsPaid(compraId: number) {
    return this.http.put(`${this.baseUrl}/mark-as-paid/${compraId}`, {}, { headers: this.headers() });
  }

  markAsUnpaid(compraId: number) {
    return this.http.patch(`${this.baseUrl}/mark-as-unpaid/${compraId}`, {}, { headers: this.headers() });
  }
}
