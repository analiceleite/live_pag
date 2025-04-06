
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  cpf: any;

  constructor(private http: HttpClient) {}

  private headers() {
    const role = localStorage.getItem('role') || 'usuario'; 
    return new HttpHeaders({ 'x-role': role });
  }

  login(cpf: string) {
    return this.http.post(`${this.baseUrl}/login`, { cpf });
  }

  addCliente(nome: string, cpf: string) {
    return this.http.post(`${this.baseUrl}/clientes`, { nome, cpf }, { headers: this.headers() });
  }

  addPeca(nome: string, preco: number) {
    return this.http.post(`${this.baseUrl}/pecas`, { nome, preco }, { headers: this.headers() });
  }

  criarCompra(cliente_id: number, pecas: number[]) {
    return this.http.post(`${this.baseUrl}/compras`, { cliente_id, pecas }, { headers: this.headers() });
  }

  getPendenciasAdmin() {
    return this.http.get<any[]>(`${this.baseUrl}/admin/pendencias`, {
      headers: this.headers()
    }).pipe(
      tap(data => {
        console.log('Pendências recebidas:', data); 
      }),
      catchError((error) => {
        console.error('Erro ao buscar pendências do admin:', error);
        return of([]); 
      })
    );
  }
  
  getPecas() {
    return this.http.get<any[]>(`${this.baseUrl}/pecas`, { headers: this.headers() }).pipe(
      tap(data => {
        console.log('Pecas recebidas:', data); 
      }),
      catchError((error) => {
        console.error('Erro ao buscar peças:', error);
        return of([]); 
      })
    );
  }

  getClientes() {
    return this.http.get<any[]>(`${this.baseUrl}/clientes`, { headers: this.headers() }).pipe(
      tap(data => {
        console.log('Clientes recebidos:', data); 
      }),
      catchError((error) => {
        console.error('Erro ao buscar clientes:', error);
        return of([]); 
      })
    );
  }
}
