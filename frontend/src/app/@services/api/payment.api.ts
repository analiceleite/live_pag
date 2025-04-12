import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PaymentMethod {
    id: number;
    created_at: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentApi {
    private baseUrl = `http://localhost:3000`;

    constructor(private http: HttpClient) {}

    getAll(): Observable<PaymentMethod[]> {
        return this.http.get<PaymentMethod[]>(`${this.baseUrl}/get-payment-method`);
    }

    getActive(): Observable<PaymentMethod> {
        return this.http.get<PaymentMethod>(`${this.baseUrl}/get-active-payment-method`);
    }

    setActive(name: string): Observable<PaymentMethod> {
        return this.http.post<PaymentMethod>(`${this.baseUrl}/set-active-payment-method`, { name});
    }
} 