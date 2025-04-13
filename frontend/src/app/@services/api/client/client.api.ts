import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientApi {
  private baseUrl = 'http://localhost:3000';
  private clientSubject = new BehaviorSubject<any[]>([]);
  client$ = this.clientSubject.asObservable();

  constructor(private http: HttpClient) { }

  private headers() {
    const role = localStorage.getItem('role') || 'user';
    return new HttpHeaders({ 'x-role': role });
  }

  getAll() {
    this.http.get<any[]>(`${this.baseUrl}/clients`, { headers: this.headers() }).subscribe((clients: any[]) => {
      this.clientSubject.next(clients); 
    });
  }

  add(client: {
    name: string;
    cpf: string;
    instagram: string;
    phone: string;
    zip_code: string;
    address: string;
    reference_point: string;
  }) {
    return this.http.post(`${this.baseUrl}/clients`, client, { headers: this.headers() });
  }

  edit(id: number, client: {
    name: string;
    cpf: string;
    instagram: string;
    phone: string;
    zip_code: string;
    address: string;
    reference_point: string;
  }) {
    return this.http.put(`${this.baseUrl}/clients/${id}`, client, { headers: this.headers() }).pipe(
      tap(() => {
        this.getAll(); 
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/clients/${id}`, { headers: this.headers() }).pipe(
      tap(() => {
        const updatedClients = this.clientSubject.value.filter(client => client.id !== id);
        this.clientSubject.next(updatedClients);
      })
    );
  }
}
