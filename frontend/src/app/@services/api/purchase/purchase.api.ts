import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase, Client, PaymentMethod } from '../../models/purchase.interface';
import { ApiConfig } from '../api.config';

@Injectable({ providedIn: 'root' })
export class PurchaseApi {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-role': localStorage.getItem('role') || 'user'
    });
  }

  getAllPendencies(): Observable<Client[]> {
    return this.http.get<Client[]>(ApiConfig.PURCHASE.PENDENCIES, { headers: this.getHeaders() });
  }

  getPendenciesByClient(clientId: number): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(ApiConfig.PURCHASE.PENDENCIES_BY_CLIENT(clientId), { headers: this.getHeaders() });
  }

  markAsPaid(purchaseId: number, paymentMethodId: number): Observable<any> {
    return this.http.put(ApiConfig.PURCHASE.MARK_AS_PAID(purchaseId), 
      { payment_method_id: paymentMethodId },
      { headers: this.getHeaders() }
    );
  }

  markAsUnpaid(purchaseId: number): Observable<any> {
    return this.http.patch(ApiConfig.PURCHASE.MARK_AS_UNPAID(purchaseId), {}, { headers: this.getHeaders() });
  }

  markAsSent(purchaseId: number): Observable<any> {
    return this.http.put(ApiConfig.PURCHASE.MARK_AS_SENT(purchaseId), {}, { headers: this.getHeaders() });
  }

  markAsNotSent(purchaseId: number): Observable<any> {
    return this.http.put(ApiConfig.PURCHASE.MARK_AS_NOT_SENT(purchaseId), {}, { headers: this.getHeaders() });
  }

  requestDelivery(purchaseId: number): Observable<any> {
    return this.http.put(ApiConfig.PURCHASE.REQUEST_DELIVERY(purchaseId), {}, { headers: this.getHeaders() });
  }

  getDeliveriesRequested(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(ApiConfig.PURCHASE.DELIVERIES_REQUESTED, { headers: this.getHeaders() });
  }

  createPurchase(clientId: number, clothings: any[]): Observable<any> {
    return this.http.post(ApiConfig.PURCHASE.CREATE, 
      { client_id: clientId, clothings },
      { headers: this.getHeaders() }
    );
  }
}
