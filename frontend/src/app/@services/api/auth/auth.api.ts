import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../api.config';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApi {
  constructor(private http: HttpClient) {}

  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  login(phone: string) {
    return this.http.post(ApiConfig.AUTH.LOGIN, { phone });
  }

  loginAdmin(username: string, password: string): Observable<any>{
    return this.http.post(ApiConfig.AUTH.LOGIN_ADMIN, { username, password });
  }

  setToken(token: string) {
    localStorage.setItem('auth_token', token);
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
