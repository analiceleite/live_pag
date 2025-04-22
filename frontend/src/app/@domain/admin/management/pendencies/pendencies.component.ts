import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';
import { Client, ClientPendencies, PurchaseWithUI, PaymentMethod, PurchaseTab } from '../../../../@services/models/purchase.interface';
import { PurchaseService } from '../../../../@services/api/purchase/purchase.service';

@Component({
    selector: 'app-pendencies',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        BackToMenuComponent,
    ],
    templateUrl: './pendencies.component.html'
})
export class PendenciesComponent implements OnInit {
    clients: ClientPendencies[] = [];
    displayedColumns: string[] = ['name', 'purchases'];
    selected_tab: PurchaseTab = 'open';
    paymentMethods: PaymentMethod[] = [];
    selectedPaymentMethodId: number | null = null;
    filter: string = '';
    selected_client_cpf: string | null = null;

    constructor(private purchaseService: PurchaseService, private router: Router) { }

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.loadPendencies();
        this.loadPaymentMethods();
    }

    private loadPendencies(): void {
        this.purchaseService.loadPendencies().subscribe((clients: Client[]) => {
            // Transformar os dados recebidos em ClientPendencies[]
            this.clients = clients.map(client => {
                const clientPendencies: ClientPendencies = {
                    client: client.client,
                    cpf: client.cpf,
                    total_amount: client.purchases.reduce((total, purchase) => total + parseFloat(purchase.price || '0'), 0),
                    purchases: client.purchases.map(p => ({ ...p, showPaymentOptions: false })),
                    delivery_requested: client.purchases.some(p => p.is_delivery_asked)
                };

                // Determinar método de pagamento predominante para o cliente
                const paidPurchases = client.purchases.filter(p => p.is_paid && p.payment_method);
                if (paidPurchases.length > 0) {
                    // Usar o método de pagamento da compra mais recente
                    clientPendencies.payment_method = this.getPaymentMethodDisplayName(paidPurchases[0].payment_method);
                }

                return clientPendencies;
            });
        });
    }

    private getPaymentMethodDisplayName(methodName?: string): string {
        if (!methodName) return '';

        if (methodName.toLowerCase().includes('nubank')) return 'Nubank';
        if (methodName.toLowerCase().includes('picpay')) return 'PicPay';
        return methodName;
    }

    private loadPaymentMethods(): void {
        this.purchaseService.loadPaymentMethods().subscribe(methods => {
            this.paymentMethods = methods;
            if (this.paymentMethods.length > 0) {
                this.selectedPaymentMethodId = this.paymentMethods[0].id;
            }
        });
    }

    showPaymentOptions(purchaseId: number): void {
        // Fechar todos os outros menus de opções de pagamento
        this.clients.forEach(client => {
            client.purchases.forEach(purchase => {
                if (purchase.id !== purchaseId) {
                    purchase.showPaymentOptions = false;
                }
            });
        });

        // Alternar menu para a compra selecionada
        const purchase = this.findPurchaseById(purchaseId);
        if (purchase) {
            purchase.showPaymentOptions = !purchase.showPaymentOptions;
        }
    }

    markAsPaid(purchaseId: number, paymentMethodType: 'Nubank' | 'PicPay'): void {
        // Mapear o tipo de método de pagamento para o ID correspondente
        const paymentMethodId = paymentMethodType === 'Nubank' ? 3 : 4;

        this.purchaseService.markAsPaid(purchaseId, paymentMethodId).subscribe(() => {
            // Fechar o menu de opções de pagamento
            const purchase = this.findPurchaseById(purchaseId);
            if (purchase) {
                purchase.showPaymentOptions = false;
                purchase.is_paid = true;
                purchase.payment_method = paymentMethodType;
            }

            // Atualizar o método de pagamento do cliente
            const client = this.findClientByPurchaseId(purchaseId);
            if (client) {
                client.payment_method = paymentMethodType;
            }

            // Atualizar dados para garantir consistência
            this.loadPendencies();
        });
    }

    markAsUnpaid(purchaseId: number): void {
        this.purchaseService.markAsUnpaid(purchaseId).subscribe(() => {
            const purchase = this.findPurchaseById(purchaseId);
            if (purchase) {
                purchase.is_paid = false;
                purchase.payment_method = '';
            }

            this.loadPendencies();
        });
    }

    markAsSent(purchaseId: number): void {
        this.purchaseService.markAsSent(purchaseId).subscribe(() => {
            const purchase = this.findPurchaseById(purchaseId);
            if (purchase) {
                purchase.is_delivery_sent = true;
            }

            this.loadPendencies();
        });
    }

    markAsNotSent(purchaseId: number): void {
        this.purchaseService.markAsNotSent(purchaseId).subscribe(() => {
            const purchase = this.findPurchaseById(purchaseId);
            if (purchase) {
                purchase.is_delivery_sent = false;
            }

            this.loadPendencies();
        });
    }

    markAsDeleted(purchaseId: number): void {
        this.purchaseService.masAsDeleted(purchaseId).subscribe(() => {
            const purchase = this.findPurchaseById(purchaseId);
            if (purchase) {
                purchase.is_deleted = true;
            }

            this.loadPendencies();
        });
    }

    returnToOpen(purchaseId: number): void {
        this.purchaseService.markAsUndeleted(purchaseId).subscribe(() => {
            this.purchaseService.markAsNotSent(purchaseId).subscribe(() => {
                this.purchaseService.markAsUnpaid(purchaseId).subscribe(() => {
                    const purchase = this.findPurchaseById(purchaseId);
                    if (purchase) {
                        purchase.is_paid = false;
                        purchase.is_delivery_sent = false;
                        purchase.is_deleted = false || true;
                        purchase.payment_method = '';
                    }

                    this.selected_tab = 'open';

                    this.loadPendencies();
                });
            });
        });
    }

    // Helper methods
    private findPurchaseById(purchaseId: number): PurchaseWithUI | null {
        for (const client of this.clients) {
            const purchase = client.purchases.find(p => p.id === purchaseId || p.purchase_id === purchaseId);
            if (purchase) return purchase;
        }
        return null;
    }

    private findClientByPurchaseId(purchaseId: number): ClientPendencies | null {
        return this.clients.find(client =>
            client.purchases.some(purchase => purchase.id === purchaseId || purchase.purchase_id === purchaseId)
        ) || null;
    }

    toggleSelectedClient(cpf: string): void {
        this.selected_client_cpf = this.selected_client_cpf === cpf ? null : cpf;
    }

    // Template helper methods
    getFilteredClients(): ClientPendencies[] {
        return this.clients
            .map(client => ({
                ...client,
                purchases: client.purchases.filter(purchase => {
                    switch (this.selected_tab) {
                        case 'open':
                            return !purchase.is_paid && !purchase.is_delivery_sent && !purchase.is_deleted;
                        case 'sent':
                            return purchase.is_paid && !purchase.is_delivery_sent && !purchase.is_deleted;
                        case 'completed':
                            return purchase.is_paid && purchase.is_delivery_sent && !purchase.is_deleted;
                        case 'deleted':
                            return purchase.is_deleted === true;
                        default:
                            return true;
                    }
                })
            }))
            .filter(client => {
                const matchesFilter = !this.filter ||
                    client.client.toLowerCase().includes(this.filter.toLowerCase()) ||
                    client.cpf.toLowerCase().includes(this.filter.toLowerCase());
                return matchesFilter && client.purchases.length > 0; // Exibe apenas clientes com compras visíveis
            });
    }

    getTotalAmount(client: ClientPendencies): number {
        return client.total_amount;
    }

    // Método para verificar se o cliente tem entrega solicitada
    hasDeliveryRequested(client: ClientPendencies): boolean {
        return client.delivery_requested === true;
    }

    // Obter método de pagamento do cliente
    getPaymentMethod(client: ClientPendencies): string | null {
        return client.payment_method || null;
    }

    gotToNewPurchase(): void {
        this.router.navigate(['/cadastro-compras']);
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
}