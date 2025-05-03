import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PixKey {
  _id: string;
  key: string;
  type: 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA';
  receptor_name: string;
  city: string;
  description: string;
  active: boolean;
  main: boolean;
  created_at: Date;
  updated_at: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PixKeyService {
  private apiUrl = `${environment.apiUrl}/pix`;

  constructor(private http: HttpClient) {}

  getAvailablePixKeys(): Observable<PixKey[]> {
    return this.http.get<PixKey[]>(`${this.apiUrl}/keys/available`);
  }

  getAllPixKeys(): Observable<PixKey[]> {
    return this.http.get<PixKey[]>(`${this.apiUrl}/keys`);
  }

  getPixKeyById(id: string): Observable<PixKey> {
    return this.http.get<PixKey>(`${this.apiUrl}/keys/${id}`);
  }

  createPixKey(pixKey: Omit<PixKey, '_id' | 'created_at' | 'updated_at'>): Observable<{ message: string; pixKey: PixKey }> {
    return this.http.post<{ message: string; pixKey: PixKey }>(`${this.apiUrl}/keys`, pixKey);
  }

  updatePixKey(id: string, pixKey: Partial<PixKey>): Observable<{ message: string; pixKey: PixKey }> {
    return this.http.put<{ message: string; pixKey: PixKey }>(`${this.apiUrl}/keys/${id}`, pixKey);
  }

  setMainPixKey(id: string): Observable<{ message: string; pixKey: PixKey }> {
    return this.http.put<{ message: string; pixKey: PixKey }>(`${this.apiUrl}/keys/${id}/main`, {});
  }

  deletePixKey(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/keys/${id}`);
  }
}
