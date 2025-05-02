import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { 
  ClientPendencies, 
  PaymentMethod, 
  PurchaseGroup, 
  PurchaseTab, 
  PurchaseWithUI 
} from '../../../../../@services/models/purchase.interface';
import { PurchaseService } from '../../../../../@services/api/purchase/purchase.service';

@Injectable({
  providedIn: 'root'
})
export class PendenciesDataService {
  private clients: ClientPendencies[] = [];
  private paymentMethods: PaymentMethod[] = [];

  constructor(private purchaseService: PurchaseService) { }

  loadPendencies(): Observable<ClientPendencies[]> {
    return this.purchaseService.loadPendencies().pipe(
      map(clients => {
        this.clients = clients.map(client => {
          const purchasesByDate = client.purchases.reduce((groups, purchase) => {
            const date = purchase.created_at?.split('T')[0] || 'No Date';
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push({
              ...purchase,
              showPaymentOptions: false,
              showDeleteOption: false,
              tracking_code: purchase.tracking_code || '',
            });
            return groups;
          }, {} as { [key: string]: PurchaseWithUI[] });

          const purchase_groups = Object.entries(purchasesByDate).map(([date, purchases]) => ({
            date,
            purchases,
            total_amount: purchases.reduce((total, p) => total + parseFloat(p.price || '0'), 0),
            is_paid: purchases.every(p => p.is_paid),
            is_delivery_sent: purchases.every(p => p.is_delivery_sent),
            is_deleted: purchases.every(p => p.is_deleted),
            is_delivery_asked: purchases.some(p => p.is_delivery_asked),
            delivery_requested: purchases.some(p => p.is_delivery_asked),
            payment_method: purchases.find(p => p.payment_method)?.payment_method,
            tracking_code: purchases.find(p => p.tracking_code)?.tracking_code || '',
            showPaymentOptions: false,
            showDeleteOption: false,
            isExpanded: false
          }));

          const clientPendencies: ClientPendencies = {
            client: client.client,
            cpf: client.cpf,
            phone: client.phone,
            total_amount: purchase_groups.reduce((total, group) => total + group.total_amount, 0),
            purchases: client.purchases.map(p => ({
              ...p,
              showPaymentOptions: false,
              showDeleteOption: false
            })),
            purchase_groups,
            delivery_requested: client.purchases.some(p => p.is_delivery_asked)
          };

          return clientPendencies;
        });
        return this.clients;
      })
    );
  }

  loadPaymentMethods(): Observable<PaymentMethod[]> {
    return this.purchaseService.loadPaymentMethods().pipe(
      map(methods => {
        this.paymentMethods = methods;
        return methods;
      })
    );
  }

  getFilteredClients(selectedTab: PurchaseTab, filter: string): ClientPendencies[] {
    return this.clients
      .map(client => ({
        ...client,
        purchase_groups: client.purchase_groups.filter(group => {
          switch (selectedTab) {
            case 'open':
              return !group.is_paid && !group.is_delivery_sent && !group.is_deleted;
            case 'sent':
              return group.is_paid && !group.is_delivery_sent && !group.is_deleted;
            case 'completed':
              return group.is_paid && group.is_delivery_sent && !group.is_deleted;
            case 'deleted':
              return group.is_deleted;
            default:
              return true;
          }
        })
      }))
      .filter(client => {
        const matchesFilter = !filter ||
          client.client.toLowerCase().includes(filter.toLowerCase()) ||
          client.cpf.toLowerCase().includes(filter.toLowerCase());
        return matchesFilter && client.purchase_groups.length > 0;
      });
  }

  getOpenCount(): number {
    return this.clients.reduce((count, client) => {
      return count + client.purchases.filter(purchase => !purchase.is_paid && !purchase.is_delivery_sent).length;
    }, 0);
  }

  getSentCount(): number {
    return this.clients.reduce((count, client) => {
      return count + client.purchases.filter(purchase => purchase.is_paid && !purchase.is_delivery_sent).length;
    }, 0);
  }

  getCompletedCount(): number {
    return this.clients.reduce((count, client) => {
      return count + client.purchases.filter(purchase => purchase.is_paid && purchase.is_delivery_sent).length;
    }, 0);
  }

  findPurchaseById(purchaseId: number): PurchaseWithUI | null {
    for (const client of this.clients) {
      const purchase = client.purchases.find(p => p.id === purchaseId || p.purchase_id === purchaseId);
      if (purchase) return purchase;
    }
    return null;
  }

  findClientByPurchaseId(purchaseId: number): ClientPendencies | null {
    return this.clients.find(client =>
      client.purchases.some(purchase => purchase.id === purchaseId || purchase.purchase_id === purchaseId)
    ) || null;
  }

  findClientByCpf(cpf: string): ClientPendencies | null {
    return this.clients.find(c => c.cpf === cpf) || null;
  }

  findGroupByDateAndClientCpf(date: string, cpf: string): PurchaseGroup | null {
    const client = this.findClientByCpf(cpf);
    if (!client) return null;
    return client.purchase_groups.find(g => g.date === date) || null;
  }

  // Operations on purchases
  markAsPaid(purchaseId: number, paymentMethodType: 'Nubank' | 'PicPay'): Observable<void> {
    const paymentMethodName = paymentMethodType === 'Nubank' ? 'nubank' : 'picpay';
    return this.purchaseService.markAsPaid(purchaseId, paymentMethodName);
  }

  markAsUnpaid(purchaseId: number): Observable<void> {
    return this.purchaseService.markAsUnpaid(purchaseId);
  }

  markAsSent(purchaseId: number): Observable<void> {
    return this.purchaseService.markAsSent(purchaseId);
  }

  markAsNotSent(purchaseId: number): Observable<void> {
    return this.purchaseService.markAsNotSent(purchaseId);
  }

  markAsDeleted(purchaseId: number): Observable<void> {
    return this.purchaseService.masAsDeleted(purchaseId);
  }

  returnToOpen(purchaseId: number): Observable<void> {
    return this.purchaseService.returnToOpen(purchaseId);
  }

  updateTrackingCode(purchaseId: number, trackingCode: string | null): Observable<any> {
    return this.purchaseService.updateTrackingCode(purchaseId, trackingCode);
  }

  // Group operations
  markGroupAsPaid(date: string, clientCpf: string, paymentMethodType: 'Nubank' | 'PicPay'): Observable<void> {
    const group = this.findGroupByDateAndClientCpf(date, clientCpf);
    if (!group) return of(void 0);

    const paymentMethodName = paymentMethodType === 'Nubank' ? 'nubank' : 'picpay';
    const markPaidPromises = group.purchases.map(purchase =>
      this.purchaseService.markAsPaid(purchase.id || purchase.purchase_id, paymentMethodName).toPromise()
    );

    return new Observable<void>(observer => {
      Promise.all(markPaidPromises)
        .then(() => {
          group.is_paid = true;
          group.payment_method = paymentMethodType;
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  markGroupAsSent(date: string, clientCpf: string): Observable<void> {
    const group = this.findGroupByDateAndClientCpf(date, clientCpf);
    if (!group) return of(void 0);

    const markSentPromises = group.purchases.map(purchase =>
      this.purchaseService.markAsSent(purchase.id || purchase.purchase_id).toPromise()
    );

    return new Observable<void>(observer => {
      Promise.all(markSentPromises)
        .then(() => {
          group.is_delivery_sent = true;
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  markGroupAsDeleted(date: string, clientCpf: string): Observable<void> {
    const group = this.findGroupByDateAndClientCpf(date, clientCpf);
    if (!group) return of(void 0);

    const deletePromises = group.purchases.map(purchase =>
      this.purchaseService.masAsDeleted(purchase.id || purchase.purchase_id).toPromise()
    );

    return new Observable<void>(observer => {
      Promise.all(deletePromises)
        .then(() => {
          group.is_deleted = true;
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  returnGroupToOpen(date: string, clientCpf: string): Observable<void> {
    const group = this.findGroupByDateAndClientCpf(date, clientCpf);
    if (!group) return of(void 0);

    const promises = group.purchases.map(purchase =>
      this.purchaseService.returnToOpen(purchase.id || purchase.purchase_id).toPromise()
    );

    return new Observable<void>(observer => {
      Promise.all(promises)
        .then(() => {
          group.is_paid = false;
          group.is_delivery_sent = false;
          group.is_deleted = false;
          group.payment_method = '';
          group.tracking_code = '';
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  updateGroupTrackingCode(date: string, clientCpf: string, trackingCode: string): Observable<void> {
    const group = this.findGroupByDateAndClientCpf(date, clientCpf);
    if (!group) return of(void 0);

    const updatePromises = group.purchases.map(purchase =>
      this.purchaseService.updateTrackingCode(
        purchase.id || purchase.purchase_id,
        trackingCode || null
      ).toPromise()
    );

    return new Observable<void>(observer => {
      Promise.all(updatePromises)
        .then(() => {
          group.tracking_code = trackingCode || '';
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
