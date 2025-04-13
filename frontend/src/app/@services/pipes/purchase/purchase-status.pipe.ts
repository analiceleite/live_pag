import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../../models/purchase.interface';

@Pipe({
    name: 'purchaseStatusFilter',
    standalone: true
})
export class PurchaseStatusFilterPipe implements PipeTransform {
    transform(clients: Client[], filter: string, status: 'open' | 'sent' | 'completed' | 'deleted'): Client[] {
        if (!clients) return [];

        return clients.filter(client => {
            // Filter by search term
            const matchesFilter = !filter || 
                client.client.toLowerCase().includes(filter.toLowerCase()) ||
                client.cpf.toLowerCase().includes(filter.toLowerCase());

            // Filter by status
            const hasMatchingPurchases = client.purchases.some(purchase => {
                switch (status) {
                    case 'open':
                        return !purchase.is_paid;
                    case 'sent':    
                        return purchase.is_paid && !purchase.is_delivery_sent;
                    case 'completed':
                        return purchase.is_paid && purchase.is_delivery_sent;
                    case 'deleted':
                        return purchase.is_deleted;
                    default:
                        return true;
                }
            });

            return matchesFilter && hasMatchingPurchases;
        });
    }
}
