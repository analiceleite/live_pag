import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClothingApi {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  private headers() {
    const role = localStorage.getItem('role') || 'user';
    return new HttpHeaders({ 'x-role': role });
  }

  getAll() {
    return this.http.get(`${this.baseUrl}/clothings`, { headers: this.headers() });
  }

  add(data: {
    name: string;
    price: number;
    queue_name: string;
    purchase_channel: string;
    purchase_type: string;
    discount: number;
  }) {
    return this.http.post(`${this.baseUrl}/clothings`, data, {
      headers: this.headers()
    });
  }

  update(piece: any) {
    return this.http.put(`${this.baseUrl}/clothings/${piece.id}`, piece, { headers: this.headers() });
  }
  
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/clothings/${id}`, { headers: this.headers() });
  }
}
