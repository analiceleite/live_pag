import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MiningApi {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private headers() {
    const role = localStorage.getItem('role') || 'user';
    return new HttpHeaders({ 'x-role': role });
  }

  createMining(quantity: number, total_value: number, notes: string): Observable<any> {
    const data = { quantity, total_value, notes };
    return this.http.post(`${this.baseUrl}/mining`, data, { headers: this.headers() });
  }

  getMining(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mining`, { headers: this.headers() });
  }

  updateMining(id: number, quantity: number, total_value: number, notes: string): Observable<any> {
    const data = { quantity, total_value, notes };
    return this.http.put(`${this.baseUrl}/mining/${id}`, data, { headers: this.headers() });
  }

  deleteMining(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/mining/${id}`, { headers: this.headers() });
  }
}
