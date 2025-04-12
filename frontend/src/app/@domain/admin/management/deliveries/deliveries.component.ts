import { Component } from '@angular/core';
import { PurchaseApi } from '../../../../@services/api/purchase.api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule, BackToMenuComponent],
  templateUrl: './deliveries.component.html',
})
export class DeliveriesComponent {
  delivery_requested_list: any[] = [];
  selected_client_id: number | null = null;
  filter: string = '';
  selected_tab: 'requested' | 'sent' = 'requested';

  constructor(private purchaseService: PurchaseApi) {
    this.loadDeliveryRequestedList();
  }

  loadDeliveryRequestedList() {
    this.purchaseService.getAllDeliveriesRequested().subscribe({
      next: (res: any[]) => {
        this.delivery_requested_list = res;
        console.log(this.delivery_requested_list);
      },
      error: (err: any) => {
        console.error('Erro ao carregar entregas solicitadas:', err);
      }
    });
  }

  getTotalAmount(purchases: any[]) {
    return purchases.reduce((total, p) => total + Number(p.total_amount || 0), 0);
  }

  toggleSelectedClient(client_id: number) {
    this.selected_client_id = this.selected_client_id === client_id ? null : client_id;
  }

  markAsSent(purchase_id: number) {
    this.purchaseService.markAsSent(purchase_id).subscribe({
      next: () => this.loadDeliveryRequestedList(),
      error: (err: any) => {
        console.error('Erro ao marcar como enviado:', err);
      }
    });
  }

  markAsNotSent(purchase_id: number) {
    this.purchaseService.markAsNotSent(purchase_id).subscribe({
      next: () => this.loadDeliveryRequestedList(),
      error: (err: any) => {
        console.error('Erro ao desfazer envio:', err);
      }
    });
  }

  // Função para filtrar entregas
  filteredDeliveries() {
    const normalizedFilter = this.filter?.toLowerCase() || '';

    return this.delivery_requested_list.filter(delivery => {
      // Filtrando por status de entrega
      const matchesDeliveryStatus =
        this.selected_tab === 'requested' ? !delivery.is_delivery_sent && delivery.is_delivery_asked
        : this.selected_tab === 'sent' ? delivery.is_delivery_sent
        : false;

      // Filtrando por nome ou CPF
      const matchesFilter = delivery.client_name?.toLowerCase().includes(normalizedFilter)
        || delivery.client_cpf?.includes(normalizedFilter);

      return matchesDeliveryStatus && matchesFilter;
    });
  }
}
