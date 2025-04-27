import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';
import { PaymentMethod } from '../../models/purchase.interface';

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
  constructor(private http: HttpClient) {}

  getAll(): Observable<LocalPaymentMethod[]> {
    return this.http.get<LocalPaymentMethod[]>(ApiConfig.PAYMENT.GET_ALL);
  }

  getActive(): Observable<LocalPaymentMethod> {
    return this.http.get<LocalPaymentMethod>(ApiConfig.PAYMENT.GET_ACTIVE);
  }

  setActive(name: string): Observable<void> {
    return this.http.put<void>(ApiConfig.PAYMENT.SET_ACTIVE, { name });
  }

  getMonthlyData(period: Period): Observable<MonthlyData> {
    return this.http.get<MonthlyData>(ApiConfig.PAYMENT.MONTHLY_DATA, { params: { ...period } });
  }

  exportMonthlyData(period: Period): Observable<Blob> {
    return this.http.get(ApiConfig.PAYMENT.EXPORT, {
      params: { ...period },
      responseType: 'blob'
    });
  }
}

export type { PaymentMethod };
