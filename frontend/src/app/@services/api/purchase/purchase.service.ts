import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchaseApi } from './purchase.api';
import { PaymentApi } from '../shared/payment.api';
import { Purchase, Client, PaymentMethod } from '../../models/purchase.interface';
import { Observable, map, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {
    constructor(
        private purchaseApi: PurchaseApi,
        private paymentApi: PaymentApi,
        private snackBar: MatSnackBar
    ) {}

    loadPendencies(): Observable<Client[]> {
        return this.purchaseApi.getAllPendencies().pipe(
            map(clients => {
                return clients.map(client => ({
                    ...client,
                    purchases: this.groupPurchasesByClient(client.purchases || [])
                }));
            })
        );
    }

    loadPaymentMethods(): Observable<PaymentMethod[]> {
        return this.paymentApi.getAll();
    }

    markAsPaid(purchaseId: number, paymentMethodId: number): Observable<void> {
        return this.purchaseApi.markAsPaid(purchaseId, paymentMethodId).pipe(
            map(() => {
                this.showSuccess('Pagamento registrado com sucesso!');
            })
        );
    }

    markAsUnpaid(purchaseId: number): Observable<void> {
        return this.purchaseApi.markAsUnpaid(purchaseId).pipe(
            map(() => {
                this.showSuccess('Pagamento desfeito com sucesso!');
            })
        );
    }

    markAsSent(purchaseId: number): Observable<void> {
        return this.purchaseApi.markAsSent(purchaseId).pipe(
            map(() => {
                this.showSuccess('Entrega registrada com sucesso!');
            })
        );
    }

    markAsNotSent(purchaseId: number): Observable<void> {
        return this.purchaseApi.markAsNotSent(purchaseId).pipe(
            map(() => {
                this.showSuccess('Entrega desfeita com sucesso!');
            })
        );
    }

    returnToOpen(purchaseId: number): Observable<void> {
        return this.purchaseApi.markAsNotSent(purchaseId).pipe(
            switchMap(() => this.purchaseApi.markAsUnpaid(purchaseId)),
            tap(() => {
                this.showSuccess('Compra retornada para aberta com sucesso!');
            }),
            map(() => undefined)
        );
    }

    getPendenciesByClient(clientId: number): Observable<Purchase[]> {
        return this.purchaseApi.getPendenciesByClient(clientId);
    }

    getDeliveriesRequested(): Observable<Purchase[]> {
        return this.purchaseApi.getDeliveriesRequested();
    }

    createPurchase(clientId: number, clothings: any[]): Observable<void> {
        return this.purchaseApi.createPurchase(clientId, clothings).pipe(
            map(() => {
                this.showSuccess('Compra criada com sucesso!');
            })
        );
    }

    private groupPurchasesByClient(purchases: Purchase[]): Purchase[] {
        return purchases.reduce((acc: Purchase[], purchase: Purchase) => {
            const existingPurchase = acc.find(p => p.purchase_id === purchase.purchase_id);
            if (!existingPurchase) {
                acc.push(purchase);
            }
            return acc;
        }, []);
    }

    private showSuccess(message: string): void {
        this.snackBar.open(message, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }
} 