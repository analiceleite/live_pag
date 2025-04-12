import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'purchaseStatusFilter',
  standalone: true,
})
export class PurchaseStatusFilterPipe implements PipeTransform {
  transform(clients: any[], filter: string, paymentStatus: 'open' | 'paid'): any[] {
    if (!clients) return [];

    const normalizedFilter = filter?.toLowerCase() || '';

    return clients
      .filter(client => {
        const filteredByPayment = client.purchases?.filter((p: any) => {
          if (paymentStatus === 'open') return !p.is_paid; 
          if (paymentStatus === 'paid') return p.is_paid; 
          return true;
        }) || [];

        const matchesFilter = client.name?.toLowerCase().includes(normalizedFilter) || client.cpf?.includes(normalizedFilter);

        return filteredByPayment.length > 0 && matchesFilter;
      })
      .map(client => ({
        ...client,
        purchases: client.purchases?.filter((p: any) => {
          if (paymentStatus === 'open') return !p.is_paid;
          if (paymentStatus === 'paid') return p.is_paid;

          return true;
        }) || []
      }));
  }
}
