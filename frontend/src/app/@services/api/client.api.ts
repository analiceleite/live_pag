import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClientApi {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private headers() {
    const role = localStorage.getItem('role') || 'usuario';
    return new HttpHeaders({ 'x-role': role });
  }

  add(nome: string, cpf: string) {
    return this.http.post(`${this.baseUrl}/clients`, { nome, cpf }, { headers: this.headers() });
  }

  getAll() {
    return this.http.get(`${this.baseUrl}/clients`, { headers: this.headers() });
  }
}
