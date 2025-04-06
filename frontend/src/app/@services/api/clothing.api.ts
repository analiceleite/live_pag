import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClothingApi {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private headers() {
    const role = localStorage.getItem('role') || 'usuario';
    return new HttpHeaders({ 'x-role': role });
  }

  add(nome: string, preco: number) {
    return this.http.post(`${this.baseUrl}/clothings`, { nome, preco }, { headers: this.headers() });
  }

  getAll() {
    return this.http.get(`${this.baseUrl}/clothings`, { headers: this.headers() });
  }
}
