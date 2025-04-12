import { Component, OnInit } from '@angular/core';
import { PurchaseApi } from '../../../../@services/api/purchase.api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseStatusFilterPipe } from '../../../../@services/pipes/purchaseStatusFilter.pipe';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pendencies',
  standalone: true,
  imports: [CommonModule, FormsModule, PurchaseStatusFilterPipe, BackToMenuComponent],
  templateUrl: './pendencies.component.html',
})
export class PendenciesComponent implements OnInit {
  pending_list: any[] = [];
  selected_client_id: number | null = null;
  qr_code_value: string = '';

  show_pix_modal = false;
  pix_client: any;

  filter: string = '';
  selected_tab: 'open' | 'paid' = 'open';

  paymentMethod: 'nubank' | 'picpay' = 'nubank';

  constructor(
    private purchaseService: PurchaseApi,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPendingList();
  }

  loadPendingList() {
    this.purchaseService.getAllPendencies().subscribe({
      next: (res: any[]) => {
        const grouped: { [cpf: string]: any[] } = {};

        for (const item of res) {
          if (!grouped[item.cpf]) {
            grouped[item.cpf] = [];
          }
          grouped[item.cpf].push(item);
        }

        this.pending_list = Object.entries(grouped).map(([cpf, purchases]: any) => ({
          id: cpf,
          name: purchases[0].client,
          cpf,
          purchases
        }));
      },
      error: (err: any) => {
        console.error('Erro ao carregar pendências:', err);
      },
    });
  }

  toggleSelectedClient(client_id: number) {
    this.selected_client_id = this.selected_client_id === client_id ? null : client_id;
    this.qr_code_value = '';
  }

  getTotalAmount(purchases: any[]) {
    return purchases.reduce((total, p) => total + Number(p.price), 0);
  }

  groupByPurchase(purchases: any[]) {
    const grouped: { [purchase_id: string]: any[] } = {};
    for (const item of purchases) {
      if (!grouped[item.purchase_id]) {
        grouped[item.purchase_id] = [];
      }
      grouped[item.purchase_id].push(item);
    }

    return Object.values(grouped).sort(
      (a, b) => new Date(b[0].created_at).getTime() - new Date(a[0].created_at).getTime()
    );
  }

  markAsPaid(purchase_id: number): void {
    if (this.paymentMethod === 'nubank') {
      // Lógica para pagamento via Nubank
      console.log('Pagamento via Nubank para compra:', purchase_id);
    } else {
      // Lógica para pagamento via PicPay
      console.log('Pagamento via PicPay para compra:', purchase_id);
    }
    
    this.purchaseService.markAsPaid(purchase_id).subscribe({
      next: () => {
        this.loadPendingList();
      },
      error: (error) => {
        console.error('Erro ao marcar como pago:', error);
      }
    });
  }

  markAsUnpaid(purchase_id: number) {
    this.purchaseService.markAsUnpaid(purchase_id).subscribe({
      next: () => {
        this.loadPendingList();
      },
      error: (err: any) => {
        console.error('Erro ao desfazer pagamento:', err);
      }
    });
  }
}
