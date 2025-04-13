import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';
import { PaymentMethod } from '../../models/purchase.interface';

@Injectable({ providedIn: 'root' })
export class PaymentApi {
    constructor(private http: HttpClient) {}

    getAll(): Observable<PaymentMethod[]> {
        return this.http.get<PaymentMethod[]>(ApiConfig.PAYMENT.GET_ALL);
    }

    getActive(): Observable<PaymentMethod> {
        return this.http.get<PaymentMethod>(ApiConfig.PAYMENT.GET_ACTIVE);
    }

    setActive(name: string): Observable<PaymentMethod> {
        return this.http.post<PaymentMethod>(ApiConfig.PAYMENT.SET_ACTIVE, { name });
    }
} 

export type { PaymentMethod };
