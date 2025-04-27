import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { PixApi } from '../../../../@services/api/shared/pix.api';
import { PurchaseApi } from '../../../../@services/api/purchase/purchase.api';
import { PaymentApi } from '../../../../@services/api/shared/payment.api';

@Component({
  selector: 'app-pendencies-user',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeModule, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './pendencies-user.component.html'
})
export class PendenciesUserComponent implements OnInit {
  logged_client: any = null;
  qr_code_value: string = '';
  show_qr_code = false;
  isDeliveryRequested: boolean = false;
  active_payment_method_name: string | null = null;

  pix_modal_client: any = null; 
  show_pix_modal = false;  
  activeTab: 'pending' | 'completed' = 'pending';
  isLoading = true;
  error: string | null = null;

  constructor(
    private pixService: PixApi,
    private purchaseService: PurchaseApi,
    private paymentService: PaymentApi
  ) {}

  ngOnInit() {
    const clientId = Number(localStorage.getItem('clientId'));

    if (!clientId) {
      this.error = 'ID do cliente não encontrado';
      this.isLoading = false;
      return;
    }

    this.loadClientData(clientId);
  }

  private loadClientData(clientId: number) {
    this.isLoading = true;
    this.error = null;

    this.paymentService.getActive().subscribe({
      next: (method) => {
        console.log('Active payment method:', method);
        this.active_payment_method_name = method?.name || null;
      },
      error: (err) => {
        console.error('Error loading payment method:', err);
        this.active_payment_method_name = null;
      },
      complete: () => {
        this.purchaseService.getPendenciesByClient(clientId).subscribe({
          next: (res: any[]) => {
            if (res && res.length > 0) {
              this.logged_client = {
                client: res[0].client,
                cpf: res[0].cpf,
                created_at: res[0].created_at,
                purchases: res,
              };
              this.isDeliveryRequested = res.some(purchase => purchase.is_delivery_asked);
            } else {
              this.error = 'Nenhuma compra encontrada';
            }
            this.isLoading = false;
          },
          error: (err) => {
            this.error = err.status === 403 
              ? 'Acesso não autorizado. Por favor, faça login novamente.' 
              : 'Erro ao carregar dados do cliente';
            this.isLoading = false;
            if (err.status === 403) {
              localStorage.clear();
            }
          }
        });
      }
    });
  }

  setActiveTab(tab: 'pending' | 'completed') {
    this.activeTab = tab;
  }

  getPendingPurchases() {
    if (!this.logged_client?.purchases) return [];
    return this.groupByPurchaseDate(
      this.logged_client.purchases.filter((p: any) => !p.is_paid)
    );
  }

  getCompletedPurchases() {
    if (!this.logged_client?.purchases) return [];
    return this.groupByPurchaseDate(
      this.logged_client.purchases.filter((p: any) => p.is_paid)
    );
  }

  getTotalAmount(purchases: any[]) {
    return purchases
      .filter(p => !p.is_paid)
      .reduce((total, p) => total + Number(p.price), 0);
  }

  groupByPurchaseDate(purchases: any[]) {
    const grouped: { [date: string]: any[] } = {};
    for (const item of purchases) {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    }
    // Sort dates in descending order
    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, items]) => ({
        date: new Date(date),
        items: items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }));
  }

  formatDateTime(date: string) {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  generatePix() {
    if (!this.logged_client) return;

    const total = this.getTotalAmount(this.logged_client.purchases);
    this.pixService.gerarPix(total, this.logged_client.client).subscribe({
      next: (res: { payload: string }) => {
        this.qr_code_value = res.payload;
        this.pix_modal_client = this.logged_client;
        this.show_pix_modal = true; 
      },
      error: (err: any) => {
        console.error('Erro ao gerar Pix:', err);
      }
    });
  }

  payWithPicPay() {
    const picpayLink = 'https://picpay.me/crissiatml';
    window.open(picpayLink, '_blank'); 
  }

  askForDeliver(purchaseId: number) {
    if (!purchaseId) {
      console.error('ID da compra não encontrado');
      return;
    }

    this.purchaseService.requestDelivery(purchaseId).subscribe({
      next: (res) => {
        if (this.logged_client?.purchases) {
          const purchase = this.logged_client.purchases.find((p: any) => p.purchase_id === purchaseId);
          if (purchase) {
            purchase.is_delivery_asked = true;
          }
        }
      },
      error: (err) => {
        console.error('Erro ao solicitar entrega:', err);
      }
    });
  }

  isPurchaseDeliveryRequested(purchaseId: number): boolean {
    return this.logged_client?.purchases?.some(
      (p: any) => p.purchase_id === purchaseId && p.is_delivery_asked
    ) || false;
  }

  sendProof() {
    if (!this.logged_client?.client) {
      console.error('Dados do cliente não disponíveis');
      return;
    }

    const message = `Olá! Sou ${this.logged_client.client} e estou enviando o comprovante de pagamento das minhas compras em aberto.`;
    const link = `https://wa.me/+5547984957878?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank');
  }  

  closePixModal() {
    this.show_pix_modal = false;
    this.qr_code_value = '';
    this.pix_modal_client = null;
  }

  getGroupTotal(items: any[]): number {
    return items.reduce((total, item) => total + Number(item.price), 0);
  }

  getGroupTrackingCode(items: any[]): string | null {
    // All items in a group should have the same tracking code
    return items[0]?.tracking_code || null;
  }

  askForDeliverByGroup(items: any[]) {
    if (!items?.length) return;
    
    // Get all purchase IDs from the same date
    const purchaseIds = items.map(item => item.purchase_id);
    
    this.purchaseService.requestDelivery(purchaseIds[0]).subscribe({
      next: (res) => {
        if (this.logged_client?.purchases) {
          purchaseIds.forEach(id => {
            const purchase = this.logged_client.purchases.find((p: any) => p.purchase_id === id);
            if (purchase) {
              purchase.is_delivery_asked = true;
            }
          });
        }
      },
      error: (err) => {
        console.error('Erro ao solicitar entrega:', err);
      }
    });
  }

  isGroupDeliveryRequested(items: any[]): boolean {
    return items?.some((item: any) => item.is_delivery_asked) || false;
  }

  formatClientSince(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  }

  getPendingItemsCount(): number {
    if (!this.logged_client?.purchases) return 0;
    return this.logged_client.purchases.filter((p: any) => !p.is_paid).length;
  }

  copyQrCodeValue() {
    if (this.qr_code_value) {
      navigator.clipboard.writeText(this.qr_code_value).then(() => {
        // You might want to add a toast notification here
        console.log('Código copiado com sucesso!');
      });
    }
  }

  closeQrCode() {
    this.qr_code_value = '';
  }
}
