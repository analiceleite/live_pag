import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../api.config';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  constructor(private http: HttpClient) {}

  login(cpf: string) {
    return this.http.post(ApiConfig.AUTH.LOGIN, { cpf });
  }
}
