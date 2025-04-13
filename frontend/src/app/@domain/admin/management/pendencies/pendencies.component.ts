import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { PurchaseApi } from '../../../../@services/api/purchase.api';
import { PurchaseStatusFilterPipe } from '../../../../@services/pipes/purchaseStatusFilter.pipe';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

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

interface PaymentMethod {
  id: number;
  name: string;
}

@Component({
  selector: 'app-pendencies',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    PurchaseStatusFilterPipe,
    BackToMenuComponent
  ],
  templateUrl: './pendencies.component.html'
})
export class PendenciesComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns: string[] = ['name', 'purchases'];
  selected_tab: 'open' | 'sent' | 'completed' | 'deleted' = 'open';
  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethodId: number | null = null;
  filter: string = '';
  selected_client_id: string | null = null;
  paymentMethod: 'nubank' | 'picpay' = 'nubank';

  constructor(
    private purchaseApi: PurchaseApi,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPendencies();
    this.loadPaymentMethods();
  }

  loadPendencies(): void {
    this.purchaseApi.getAllPendencies().subscribe({
      next: (data: any[]) => {
        // Group purchases by client
        const clientMap = new Map<string, Client>();
        
        data.forEach(item => {
          if (!clientMap.has(item.cpf)) {
            clientMap.set(item.cpf, {
              client: item.client,
              cpf: item.cpf,
              purchases: []
            });
          }
          
          const client = clientMap.get(item.cpf)!;
          client.purchases.push({
            purchase_id: item.purchase_id,
            created_at: item.created_at,
            is_paid: item.is_paid,
            is_delivery_asked: item.is_delivery_asked,
            is_delivery_sent: item.is_delivery_sent,
            is_deleted: item.is_deleted,
            payment_method: item.payment_method,
            price: item.price,
            clothing: item.clothing
          });
        });
        
        this.clients = Array.from(clientMap.values());
      },
      error: (error: any) => {
        console.error('Erro ao carregar pendências:', error);
        this.snackBar.open('Erro ao carregar pendências', 'Fechar', { duration: 3000 });
      }
    });
  }

  loadPaymentMethods(): void {
    this.purchaseApi.getPaymentMethods().subscribe({
      next: (methods: PaymentMethod[]) => {
        this.paymentMethods = methods;
        if (methods.length > 0) {
          this.selectedPaymentMethodId = methods[0].id;
        }
      },
      error: (error: any) => {
        console.error('Erro ao carregar métodos de pagamento:', error);
        this.snackBar.open('Erro ao carregar métodos de pagamento', 'Fechar', { duration: 3000 });
      }
    });
  }

  markAsPaid(purchaseId: number): void {
    const paymentMethodId = this.paymentMethod === 'nubank' ? 3 : 4; 
    
    this.purchaseApi.markAsPaid(purchaseId, paymentMethodId).subscribe({
      next: () => {
        this.snackBar.open('Compra marcada como paga com sucesso', 'Fechar', { duration: 3000 });
        this.loadPendencies();
      },
      error: (error: any) => {
        console.error('Erro ao marcar como paga:', error);
        this.snackBar.open('Erro ao marcar como paga', 'Fechar', { duration: 3000 });
      }
    });
  }

  markAsUnpaid(purchaseId: number): void {
    this.purchaseApi.markAsUnpaid(purchaseId).subscribe({
      next: () => {
        this.snackBar.open('Pagamento desmarcado com sucesso', 'Fechar', { duration: 3000 });
        this.loadPendencies();
      },
      error: (error: any) => {
        console.error('Erro ao desmarcar pagamento:', error);
        this.snackBar.open('Erro ao desmarcar pagamento', 'Fechar', { duration: 3000 });
      }
    });
  }

  markAsSent(purchaseId: number): void {
    this.purchaseApi.markAsSent(purchaseId).subscribe({
      next: () => {
        this.snackBar.open('Compra marcada como enviada com sucesso', 'Fechar', { duration: 3000 });
        this.loadPendencies();
      },
      error: (error: any) => {
        console.error('Erro ao marcar como enviada:', error);
        this.snackBar.open('Erro ao marcar como enviada', 'Fechar', { duration: 3000 });
      }
    });
  }

  markAsNotSent(purchaseId: number): void {
    this.purchaseApi.markAsNotSent(purchaseId).subscribe({
      next: () => {
        this.snackBar.open('Envio desmarcado com sucesso', 'Fechar', { duration: 3000 });
        this.loadPendencies();
      },
      error: (error: any) => {
        console.error('Erro ao desmarcar envio:', error);
        this.snackBar.open('Erro ao desmarcar envio', 'Fechar', { duration: 3000 });
      }
    });
  }

  markAsCompleted(purchaseId: number): void {
    this.purchaseApi.markAsCompleted(purchaseId).subscribe({
      next: () => {
        this.snackBar.open('Compra finalizada com sucesso', 'Fechar', { duration: 3000 });
        this.loadPendencies();
      },
      error: (error: any) => {
        console.error('Erro ao finalizar compra:', error);
        this.snackBar.open('Erro ao finalizar compra', 'Fechar', { duration: 3000 });
      }
    });
  }

  deletePurchase(purchaseId: number): void {
    this.purchaseApi.deletePurchase(purchaseId).subscribe({
      next: () => {
        this.snackBar.open('Compra excluída com sucesso', 'Fechar', { duration: 3000 });
        this.loadPendencies();
      },
      error: (error: any) => {
        console.error('Erro ao excluir compra:', error);
        this.snackBar.open('Erro ao excluir compra', 'Fechar', { duration: 3000 });
      }
    });
  }

  getTotalAmount(purchases: Purchase[]): number {
    return purchases.reduce((total, purchase) => total + parseFloat(purchase.price), 0);
  }

  groupByPurchase(purchases: Purchase[]): Purchase[][] {
    const groups: { [key: string]: Purchase[] } = {};
    purchases.forEach(purchase => {
      const key = purchase.created_at;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(purchase);
    });
    return Object.values(groups);
  }

  toggleSelectedClient(clientId: string): void {
    this.selected_client_id = this.selected_client_id === clientId ? null : clientId;
  }

  returnToOpen(purchaseId: number): void {
    // Primeiro desfaz o envio
    this.purchaseApi.markAsNotSent(purchaseId).subscribe({
      next: () => {
        // Depois desfaz o pagamento
        this.purchaseApi.markAsUnpaid(purchaseId).subscribe({
          next: () => {
            this.snackBar.open('Compra retornada para aberto com sucesso', 'Fechar', { duration: 3000 });
            this.loadPendencies();
          },
          error: (error: any) => {
            console.error('Erro ao desmarcar pagamento:', error);
            this.snackBar.open('Erro ao retornar compra para aberto', 'Fechar', { duration: 3000 });
          }
        });
      },
      error: (error: any) => {
        console.error('Erro ao desmarcar envio:', error);
        this.snackBar.open('Erro ao retornar compra para aberto', 'Fechar', { duration: 3000 });
      }
    });
  }
}
