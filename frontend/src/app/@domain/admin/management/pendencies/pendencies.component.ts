import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';
import { Purchase, Client, PaymentMethod, PurchaseTab } from '../../../../@services/models/purchase.interface';
import { PurchaseService } from '../../../../@services/api/purchase/purchase.service';

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
        BackToMenuComponent,
    ],
    templateUrl: './pendencies.component.html'
})
export class PendenciesComponent implements OnInit {
    clients: Client[] = [];
    displayedColumns: string[] = ['name', 'purchases'];
    selected_tab: PurchaseTab = 'open';
    paymentMethods: PaymentMethod[] = [];
    selectedPaymentMethodId: number | null = null;
    filter: string = '';
    selected_client_id: string | null = null;
    paymentMethod: 'nubank' | 'picpay' = 'nubank';

    constructor(private purchaseService: PurchaseService) { }

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.loadPendencies();
        this.loadPaymentMethods();
    }

    private loadPendencies(): void {
        this.purchaseService.loadPendencies().subscribe(clients => {
            this.clients = clients;
        });
    }

    private loadPaymentMethods(): void {
        this.purchaseService.loadPaymentMethods().subscribe(methods => {
            this.paymentMethods = methods;
            if (this.paymentMethods.length > 0) {
                this.selectedPaymentMethodId = this.paymentMethods[0].id;
            }
        });
    }

    markAsPaid(purchaseId: number): void {
        const paymentMethodId = this.paymentMethod === 'nubank' ? 3 : 4;
        this.purchaseService.markAsPaid(purchaseId, paymentMethodId).subscribe(() => {
            this.loadPendencies();
        });
    }

    markAsUnpaid(purchaseId: number): void {
        this.purchaseService.markAsUnpaid(purchaseId).subscribe(() => {
            this.loadPendencies();
        });
    }

    markAsSent(purchaseId: number): void {
        this.purchaseService.markAsSent(purchaseId).subscribe(() => {
            this.loadPendencies();
        });
    }

    markAsNotSent(purchaseId: number): void {
        this.purchaseService.markAsNotSent(purchaseId).subscribe(() => {
            this.loadPendencies();
        });
    }

    returnToOpen(purchaseId: number): void {
        this.purchaseService.markAsNotSent(purchaseId).subscribe(() => {
            this.purchaseService.markAsUnpaid(purchaseId).subscribe(() => {
                this.loadPendencies();
            });
        });
    }

    // UI helper methods
    getTotalAmount(clientOrPurchases: Client | Purchase[]): number {
        if (Array.isArray(clientOrPurchases)) {
            return clientOrPurchases.reduce((total, purchase) => total + parseFloat(purchase.price || '0'), 0);
        } else {
            return parseFloat(clientOrPurchases.price || '0');
        }
    }
 
    groupByPurchase(clientOrClients: Client | Client[]): Client[][] {
        const clients = Array.isArray(clientOrClients) ? clientOrClients : [clientOrClients];

        const groups: { [key: string]: Client[] } = {};
        clients.forEach(client => {
            const key = client.created_at;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(client);
        });
        return Object.values(groups);
    }

    toggleSelectedClient(clientId: string): void {
        this.selected_client_id = this.selected_client_id === clientId ? null : clientId;
    }

    // Template helper methods
    getFilteredClients(): Client[] {
        return this.clients.filter(client => {
            const matchesFilter = !this.filter ||
                client.client.toLowerCase().includes(this.filter.toLowerCase()) ||
                client.cpf.toLowerCase().includes(this.filter.toLowerCase());

            // Check conditions on the client object itself, not in the purchases array
            let matchesTab = false;
            switch (this.selected_tab) {
                case 'open':
                    matchesTab = !client.is_paid && !client.is_delivery_sent;
                    break;
                case 'sent':
                    matchesTab = client.is_paid && !client.is_delivery_sent;
                    break;
                case 'completed':
                    matchesTab = client.is_paid && client.is_delivery_sent;
                    break;
                case 'deleted':
                    matchesTab = client.is_deleted === true;
                    break;
                default:
                    matchesTab = true;
            }

            return matchesFilter && matchesTab;
        });
    }

    deletePurchase(purchaseId: number): void {
    }
}
