import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PurchaseApi {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private headers() {
    const role = localStorage.getItem('role') || 'user';
    return new HttpHeaders({ 'x-role': role });
  }

  // Payment Methods
  getPaymentMethods(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get-payment-method`, { headers: this.headers() });
  }

  // Purchase
  create(client_id: number, clothings: number[]) {
    return this.http.post(`${this.baseUrl}/purchase`, { client_id, clothings }, { headers: this.headers() });
  }

  // Payment
  getAllPendencies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pendencies`, { headers: this.headers() });
  }

  getPendenciesByClient(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pendencies-by-client/${clientId}`, { headers: this.headers() });
  }

  markAsPaid(purchaseId: number, paymentMethodId: number) {
    return this.http.put(`${this.baseUrl}/mark-as-paid/${purchaseId}`, { payment_method_id: paymentMethodId }, { headers: this.headers() });
  }

  markAsUnpaid(purchaseId: number) {
    return this.http.patch(`${this.baseUrl}/mark-as-unpaid/${purchaseId}`, {}, { headers: this.headers() });
  }

  markAsDelivered(purchaseId: number) {
    return this.http.put(`${this.baseUrl}/delivery/send/${purchaseId}`, {}, { headers: this.headers() });
  }

  markAsUndelivered(purchaseId: number) {
    return this.http.put(`${this.baseUrl}/delivery/cancel-send/${purchaseId}`, {}, { headers: this.headers() });
  }

  // Delivery
  requestDelivery(purchaseId: number) {
    return this.http.put(`${this.baseUrl}/delivery/request/${purchaseId}`, {}, { headers: this.headers() });
  }

  getAllDeliveriesRequested(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/deliveries-requested`, { headers: this.headers() });
  }

  markAsSent(purchaseId: number) {
    return this.http.put(`${this.baseUrl}/delivery/send/${purchaseId}`, {}, { headers: this.headers() });
  }

  markAsNotSent(purchaseId: number) {
    return this.http.put(`${this.baseUrl}/delivery/cancel-send/${purchaseId}`, {}, { headers: this.headers() });
  }

  markAsCompleted(purchaseId: number) {
    return this.http.put(`${this.baseUrl}/purchase/complete/${purchaseId}`, {}, { headers: this.headers() });
  }

  deletePurchase(purchaseId: number) {
    return this.http.delete(`${this.baseUrl}/purchase/${purchaseId}`, { headers: this.headers() });
  }
}
