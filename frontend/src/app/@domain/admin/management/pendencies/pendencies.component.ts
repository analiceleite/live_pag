import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';
import { 
    Client, 
    ClientPendencies, 
    PurchaseWithUI, 
    PaymentMethod, 
    PurchaseTab,
    PurchaseGroup 
} from '../../../../@services/models/purchase.interface';
import { PurchaseService } from '../../../../@services/api/purchase/purchase.service';
import { WhatsappService } from '../../../../@services/whatsapp/whatsapp.service';

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

    constructor(
        private purchaseService: PurchaseService, 
        private router: Router,
        private whatsappService: WhatsappService
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.loadPendencies();
        this.loadPaymentMethods();
    }

    private loadPendencies(): void {
        this.purchaseService.loadPendencies().subscribe((clients: Client[]) => {
            this.clients = clients.map(client => {
                // Group purchases by date
                const purchasesByDate = client.purchases.reduce((groups, purchase) => {
                    const date = purchase.created_at?.split('T')[0] || 'No Date';
                    if (!groups[date]) {
                        groups[date] = [];
                    }
                    groups[date].push({
                        ...purchase,
                        showPaymentOptions: false,
                        showDeleteOption: false
                    });
                    return groups;
                }, {} as { [key: string]: PurchaseWithUI[] });

                const purchase_groups = Object.entries(purchasesByDate).map(([date, purchases]) => ({
                    date,
                    purchases,
                    total_amount: purchases.reduce((total, p) => total + parseFloat(p.price || '0'), 0),
                    is_paid: purchases.every(p => p.is_paid),
                    is_delivery_sent: purchases.every(p => p.is_delivery_sent),
                    is_deleted: purchases.every(p => p.is_deleted),
                    is_delivery_asked: purchases.some(p => p.is_delivery_asked),
                    delivery_requested: purchases.some(p => p.is_delivery_asked),  // Add this line
                    payment_method: purchases.find(p => p.payment_method)?.payment_method,
                    showPaymentOptions: false,
                    showDeleteOption: false,
                    isExpanded: false // Initialize expanded state
                }));

                const clientPendencies: ClientPendencies = {
                    client: client.client,
                    cpf: client.cpf,
                    phone: client.phone,
                    total_amount: purchase_groups.reduce((total, group) => total + group.total_amount, 0),
                    purchases: client.purchases.map(p => ({
                        ...p,
                        showPaymentOptions: false,
                        showDeleteOption: false
                    })),
                    purchase_groups,
                    delivery_requested: client.purchases.some(p => p.is_delivery_asked)
                };

                return clientPendencies;
            });
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

    showPaymentOptions(purchaseId: number): void {
        this.clients.forEach(client => {
            client.purchases.forEach(purchase => {
                if (purchase.id !== purchaseId) {
                    purchase.showPaymentOptions = false;
                }
            });
        });

        const purchase = this.findPurchaseById(purchaseId);
        if (purchase) {
            purchase.showPaymentOptions = !purchase.showPaymentOptions;
        }
    }

    markAsPaid(purchaseId: number, paymentMethodType: 'Nubank' | 'PicPay'): void {
        const paymentMethodId = paymentMethodType === 'Nubank' ? 3 : 4;

        this.purchaseService.markAsPaid(purchaseId, paymentMethodId).subscribe(() => {
            const purchase = this.findPurchaseById(purchaseId);
            if (purchase) {
                purchase.showPaymentOptions = false;
                purchase.is_paid = true;
                purchase.payment_method = paymentMethodType;
            }

            const client = this.findClientByPurchaseId(purchaseId);
            if (client) {
                client.payment_method = paymentMethodType;
            }

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
        const purchase = this.findPurchaseById(purchaseId);
        if (purchase) {
            purchase.showDeleteOption = false;
        }
        
        this.purchaseService.masAsDeleted(purchaseId).subscribe(() => {
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

    returnGroupToOpen(date: string, clientCpf: string): void {
        const client = this.clients.find(c => c.cpf === clientCpf);
        const group = client?.purchase_groups.find(g => g.date === date);
        
        if (group) {
            const promises = group.purchases.map(purchase => 
                new Promise<void>((resolve) => {
                    this.purchaseService.markAsUndeleted(purchase.id || purchase.purchase_id).subscribe(() => {
                        this.purchaseService.markAsNotSent(purchase.id || purchase.purchase_id).subscribe(() => {
                            this.purchaseService.markAsUnpaid(purchase.id || purchase.purchase_id).subscribe(() => {
                                resolve();
                            });
                        });
                    });
                })
            );

            Promise.all(promises).then(() => {
                group.is_paid = false;
                group.is_delivery_sent = false;
                group.is_deleted = false;
                group.payment_method = '';
                this.selected_tab = 'open';
                this.loadPendencies();
            });
        }
    }

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

    getFilteredClients(): ClientPendencies[] {
        return this.clients
            .map(client => ({
                ...client,
                purchase_groups: client.purchase_groups.filter(group => {
                    switch (this.selected_tab) {
                        case 'open':
                            return !group.is_paid && !group.is_delivery_sent && !group.is_deleted;
                        case 'sent':
                            return group.is_paid && !group.is_delivery_sent && !group.is_deleted;
                        case 'completed':
                            return group.is_paid && group.is_delivery_sent && !group.is_deleted;
                        case 'deleted':
                            return group.is_deleted;
                        default:
                            return true;
                    }
                })
            }))
            .filter(client => {
                const matchesFilter = !this.filter ||
                    client.client.toLowerCase().includes(this.filter.toLowerCase()) ||
                    client.cpf.toLowerCase().includes(this.filter.toLowerCase());
                return matchesFilter && client.purchase_groups.length > 0;
            });
    }

    getTotalAmount(client: ClientPendencies): number {
        return client.total_amount;
    }

    hasDeliveryRequested(client: ClientPendencies): boolean {
        return client.delivery_requested === true;
    }

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

    sendWhatsAppMessage(client: ClientPendencies): void {
        if (!client.phone) {
            alert('Cliente não possui telefone cadastrado!');
            return;
        }
        
        const message = this.whatsappService.generatePendingItemsMessage(client);
        const phoneNumber = client.phone.replace(/\D/g, '');
        const formattedPhone = phoneNumber.startsWith('55') ? phoneNumber : `55${phoneNumber}`;
        
        window.open(`https://wa.me/${formattedPhone}?text=${message}`);
    }

    markGroupAsPaid(date: string, clientCpf: string, paymentMethodType: 'Nubank' | 'PicPay'): void {
        const client = this.clients.find(c => c.cpf === clientCpf);
        const group = client?.purchase_groups.find(g => g.date === date);
        
        if (group) {
            group.showPaymentOptions = false; // Close payment options after selecting
            const paymentMethodId = paymentMethodType === 'Nubank' ? 3 : 4;
            const markPaidPromises = group.purchases.map(purchase =>
                this.purchaseService.markAsPaid(purchase.id || purchase.purchase_id, paymentMethodId).toPromise()
            );

            Promise.all(markPaidPromises).then(() => {
                group.is_paid = true;
                group.payment_method = paymentMethodType;
                this.loadPendencies();
            });
        }
    }

    markGroupAsSent(date: string, clientCpf: string): void {
        const client = this.clients.find(c => c.cpf === clientCpf);
        const group = client?.purchase_groups.find(g => g.date === date);
        
        if (group) {
            const markSentPromises = group.purchases.map(purchase =>
                this.purchaseService.markAsSent(purchase.id || purchase.purchase_id).toPromise()
            );

            Promise.all(markSentPromises).then(() => {
                group.is_delivery_sent = true;
                this.loadPendencies();
            });
        }
    }

    markGroupAsDeleted(date: string, clientCpf: string): void {
        const client = this.clients.find(c => c.cpf === clientCpf);
        const group = client?.purchase_groups.find(g => g.date === date);
        
        if (group) {
            group.showDeleteOption = false; 
            const deletePromises = group.purchases.map(purchase =>
                this.purchaseService.masAsDeleted(purchase.id || purchase.purchase_id).toPromise()
            );

            Promise.all(deletePromises).then(() => {
                group.is_deleted = true;
                this.loadPendencies();
            });
        }
    }

    toggleGroupDeleteOption(group: PurchaseGroup): void {
        this.clients.forEach(client => {
            client.purchase_groups.forEach(g => {
                if (g !== group) {
                    g.showDeleteOption = false;
                }
            });
        });
        group.showDeleteOption = !group.showDeleteOption;
    }

    toggleGroup(group: PurchaseGroup): void {
        group.isExpanded = !group.isExpanded;
    }

    hasGroupDeliveryRequested(group: PurchaseGroup): boolean {
        return group.purchases.some(p => p.is_delivery_asked);
    }
}