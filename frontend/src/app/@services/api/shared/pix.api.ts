import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';

@Injectable({ providedIn: 'root' })
export class PixApi {
  constructor(private http: HttpClient) {}

  gerarPix(valor: number, cliente: string): Observable<any> {
    return this.http.post(ApiConfig.PIX.GENERATE, { valor, cliente });
  }
}
