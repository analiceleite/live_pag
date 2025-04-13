import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { PixApi } from '../../../../@services/api/shared/pix.api';
import { PurchaseApi } from '../../../../@services/api/purchase/purchase.api';
import { PaymentApi } from '../../../../@services/api/shared/payment.api';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-pendencies-user',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule],
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

  constructor(
    private pixService: PixApi,
    private purchaseService: PurchaseApi,
    private paymentService: PaymentApi
  ) {}

  ngOnInit() {
    const clientId = Number(localStorage.getItem('clientId'));

    if (!clientId) {
      console.error('Invalid client_id');
      return;
    }

    this.paymentService.getActive().subscribe({
      next: (method) => this.active_payment_method_name = method.name,
      error: () => this.active_payment_method_name = null,
    });

    this.purchaseService.getPendenciesByClient(clientId).subscribe((res: any[]) => {
      if (res.length > 0) {
        this.logged_client = {
          client: res[0].client,
          cpf: res[0].cpf,
          purchases: res,
        };
        console.log("Client purchases: ", this.logged_client, res);

        this.isDeliveryRequested = res.some(purchase => purchase.is_delivery_asked);
      }
    });
  }

  getTotalAmount(purchases: any[]) {
    return purchases
      .filter(p => !p.is_paid)
      .reduce((total, p) => total + Number(p.price), 0);
  }

  groupByPurchase(purchases: any[]) {
    const grouped: { [purchase_id: string]: any[] } = {};
    for (const item of purchases) {
      if (!grouped[item.compra_id]) {
        grouped[item.compra_id] = [];
      }
      grouped[item.compra_id].push(item);
    }
    return Object.values(grouped).filter(group => !group[0].is_paid);
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

  askForDeliver() {
    const purchaseId = this.logged_client.purchases[0].purchase_id; 
    this.purchaseService.requestDelivery(purchaseId).subscribe({
      next: (res) => {
        console.log('Entrega solicitada com sucesso:', res);
        this.isDeliveryRequested = true;
      },
      error: (err) => {
        console.error('Erro ao solicitar entrega:', err);
      }
    });
  }

  sendProof() {
    const client = this.logged_client;
    const message = `Olá! Sou ${client.client} e estou enviando o comprovante de pagamento das minhas compras em aberto.`;
    const link = `https://wa.me/+5547984957878?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank');
  }  

  closePixModal() {
    this.show_pix_modal = false;
    this.qr_code_value = '';
    this.pix_modal_client = null;
  }
}
