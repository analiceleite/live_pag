import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';
import { PaymentMethod } from '../../models/purchase.interface';
import { environment } from '../../../../environments/environment';

export interface LocalPaymentMethod {
  id: number;
  name: string;
  isActive: boolean;
}

export interface MonthlyData {
  picpayAmount: number;
  nubankAmount: number;
  investmentAmount: number;
  totalAmount: number;
  pixAmount: number;
  cardAmount: number;
  cashAmount: number;
}

export interface Period {
  month: string;
  year: number;
}

@Injectable({ providedIn: 'root' })
export class PaymentApi {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LocalPaymentMethod[]> {
    return this.http.get<LocalPaymentMethod[]>(`${this.apiUrl}/methods`);
  }

  getActive(): Observable<LocalPaymentMethod> {
    return this.http.get<LocalPaymentMethod>(`${this.apiUrl}/methods/active`);
  }

  setActive(name: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/methods/active`, { name });
  }

  getMonthlyData(period: Period): Observable<MonthlyData> {
    return this.http.get<MonthlyData>(`${this.apiUrl}/monthly`, { params: { ...period } });
  }

  exportMonthlyData(period: Period): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      params: { ...period },
      responseType: 'blob'
    });
  }
}

export type { PaymentMethod };
