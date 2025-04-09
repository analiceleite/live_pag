import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(cpf: string) {
    return this.http.post(`${this.baseUrl}/login`, { cpf });
  }
}
