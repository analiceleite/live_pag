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
    ) { }

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
                this.showMessage('Pagamento registrado com sucesso!');
            })
        );
    }

    markAsUnpaid(purchaseId: number): Observable<void> {
        return this.purchaseApi.markAsUnpaid(purchaseId).pipe(
            map(() => {
                this.showMessage('Pagamento desfeito com sucesso!');
            })
        );
    }

    markAsSent(purchaseId: number): Observable<void> {
        return this.purchaseApi.markAsSent(purchaseId).pipe(
            map(() => {
                this.showMessage('Entrega registrada com sucesso!');
            })
        );
    }

    markAsNotSent(purchaseId: number): Observable<void> {
        return this.purchaseApi.markAsNotSent(purchaseId).pipe(
            map(() => {
                this.showMessage('Entrega desfeita com sucesso!');
            })
        );
    }

    masAsDeleted(purchaseId: number): Observable<void> {
        return this.purchaseApi.markAsDeleted(purchaseId).pipe(
            map(() => {
                this.showMessage('Compra deletada com sucesso!');
            })
        );
    }

    markAsUndeleted(purchaseId: number): Observable<void> {
        return this.purchaseApi.markAsUndeleted(purchaseId).pipe(
            map(() => {
                this.showMessage('Desfeita a deleção da compra  com sucesso!');
            })
        );
    }

    returnToOpen(purchaseId: number): Observable<void> {
        return this.purchaseApi.markAsNotSent(purchaseId).pipe(
            switchMap(() => this.purchaseApi.markAsUnpaid(purchaseId)),
            tap(() => {
                this.showMessage('Compra retornada para aberta com sucesso!');
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
                this.showMessage('Compra criada com sucesso!');
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

    private showMessage(message: string): void {
        this.snackBar.open(message, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }
} 