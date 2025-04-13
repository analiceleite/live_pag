import { Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Purchase {
  purchase_id: number;
  created_at: string;
  is_paid: boolean;
  is_delivery_asked: boolean;
  is_delivery_sent: boolean;
  is_deleted: boolean;
  payment_method: string;
  price: string;
  clothing: string;
}

interface Client {
  client: string;
  cpf: string;
  purchases: Purchase[];
}

@Pipe({
  name: 'purchaseStatusFilter',
  standalone: true
})
export class PurchaseStatusFilterPipe implements PipeTransform {
  transform(clients: any[], filter: string, selectedTab: string): any[] {
    if (!clients) return [];

    return clients
      .filter(client => {
        // Filtra por nome ou CPF
        const searchTerm = filter.toLowerCase();
        const hasMatchingNameOrCpf = client.client.toLowerCase().includes(searchTerm) || 
                                    client.cpf.toLowerCase().includes(searchTerm);
        
        if (!hasMatchingNameOrCpf) return false;

        // Verifica se o cliente tem compras visíveis na aba atual
        return client.purchases.some((purchase: Purchase) => {
          // Se a compra está excluída, só mostra na aba de excluídas
          if (purchase.is_deleted) {
            return selectedTab === 'deleted';
          }

          // Se não está excluída, verifica o estado atual
          const isOpen = !purchase.is_paid; // Agora só depende do status de pagamento
          const isSent = purchase.is_paid && !purchase.is_delivery_sent;
          const isCompleted = purchase.is_paid && purchase.is_delivery_sent;

          switch (selectedTab) {
            case 'open':
              return isOpen;
            case 'sent':
              return isSent;
            case 'completed':
              return isCompleted;
            case 'deleted':
              return purchase.is_deleted;
            default:
              return false;
          }
        });
      })
      .map(client => {
        // Filtra as compras do cliente para mostrar apenas as visíveis na aba atual
        const filteredPurchases = client.purchases.filter((purchase: Purchase) => {
          if (purchase.is_deleted) {
            return selectedTab === 'deleted';
          }

          // Verifica o estado atual da compra
          const isOpen = !purchase.is_paid; // Agora só depende do status de pagamento
          const isSent = purchase.is_paid && !purchase.is_delivery_sent;
          const isCompleted = purchase.is_paid && purchase.is_delivery_sent;

          switch (selectedTab) {
            case 'open':
              return isOpen;
            case 'sent':
              return isSent;
            case 'completed':
              return isCompleted;
            case 'deleted':
              return purchase.is_deleted;
            default:
              return false;
          }
        });

        return {
          ...client,
          purchases: filteredPurchases
        };
      })
      .filter(client => client.purchases.length > 0);
  }
}
