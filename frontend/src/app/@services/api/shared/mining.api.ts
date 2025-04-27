import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';

@Injectable({ providedIn: 'root' })
export class MiningApi {
  constructor(private http: HttpClient) {}

  private headers() {
    const role = localStorage.getItem('role') || 'user';
    return new HttpHeaders({ 'x-role': role });
  }

  createMining(quantity: number, total_value: number, notes: string): Observable<any> {
    const data = { quantity, total_value, notes };
    return this.http.post(ApiConfig.MINING.CREATE, data, { headers: this.headers() });
  }

  getMining(): Observable<any[]> {
    return this.http.get<any[]>(ApiConfig.MINING.LIST, { headers: this.headers() });
  }

  updateMining(id: number, quantity: number, total_value: number, notes: string): Observable<any> {
    const data = { quantity, total_value, notes };
    return this.http.put(ApiConfig.MINING.UPDATE(id), data, { headers: this.headers() });
  }

  deleteMining(id: number): Observable<any> {
    return this.http.delete(ApiConfig.MINING.DELETE(id), { headers: this.headers() });
  }
}
