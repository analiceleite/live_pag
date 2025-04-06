import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PixApi {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private headers() {
    const role = localStorage.getItem('role') || 'usuario';
    return new HttpHeaders({ 'x-role': role });
  }

  gerarPix(valor: number, nome: string) {
    return this.http.post<{ payload: string }>(
      `${this.baseUrl}/pix`,
      { valor, nome },
      { headers: this.headers() }
    );
  }
}
