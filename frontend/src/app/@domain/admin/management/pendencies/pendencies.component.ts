import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';
import { LoadingComponent } from '../../../../@common/components/loading/loading.component';
import {
    ClientPendencies,
    PurchaseGroup,
    PurchaseTab
} from '../../../../@services/models/purchase.interface';
import { WhatsappService } from '../../../../@services/whatsapp/whatsapp.service';
import { PendenciesStateService } from './services/pendencies-state.service';
import { PendenciesDataService } from './services/pendencies-data.service';
import { ClientCardComponent } from './components/client-card/client-card.component';
import { TrackingDialogComponent } from './components/tracking-dialog/tracking-dialog.component';
import { forkJoin } from 'rxjs';
import { PixKey, PixKeyService } from '../../../../@services/api/shared/pix-key.service';

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
        LoadingComponent,
        ClientCardComponent,
        TrackingDialogComponent
    ],
    templateUrl: './pendencies.component.html'
})
export class PendenciesComponent implements OnInit {
    pixKeys: PixKey[] = [];

    constructor(
        private router: Router,
        private whatsappService: WhatsappService,
        public stateService: PendenciesStateService,
        public dataService: PendenciesDataService,
        private pixKeyService: PixKeyService
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.stateService.setLoading(true);

        forkJoin([
            this.dataService.loadPendencies(),
            this.dataService.loadPaymentMethods(),
            this.pixKeyService.getAvailablePixKeys()
        ]).subscribe({
            next: ([clients, paymentMethods, pixKeys]) => {
                this.pixKeys = pixKeys;
                this.stateService.setLoading(false);
            },
            error: (error) => {
                console.error('Error loading data:', error);
                this.stateService.setLoading(false);
            }
        });
    }

    // Tab management
    setSelectedTab(tab: PurchaseTab): void {
        this.stateService.setSelectedTab(tab);
    }

    // Filter management
    setFilter(filter: string): void {
        this.stateService.setFilter(filter);
    }

    // Client management
    toggleSelectedClient(cpf: string): void {
        this.stateService.toggleSelectedClient(cpf);
    }

    // Group management
    toggleGroup(data: { client: ClientPendencies, group: PurchaseGroup }): void {
        data.group.isExpanded = !data.group.isExpanded;
    }

    sendWhatsAppMessage(client: ClientPendencies): void {
        if (!client.phone) {
            alert('Cliente não possui telefone cadastrado!');
            return;
        }

        const orderUrl = 'https://dev--tagtrack.netlify.app/';

        const selectedPixKey = (client as any).selectedPixKey ?? null;

        console.log('Selected Pix Key:', selectedPixKey);

        const rawMessage = this.whatsappService.generatePendingItemsMessage(
            client,
            selectedPixKey,
            orderUrl
        );

        let rawPhone = client.phone.replace(/\D/g, '');

        while (rawPhone.startsWith('0')) {
            rawPhone = rawPhone.substring(1);
        }

        if (rawPhone.length <= 11) {
            rawPhone = '55' + rawPhone;
        } else if (rawPhone.startsWith('55') && rawPhone.length >= 12 && rawPhone.length <= 13) {
        } else if (rawPhone.length > 13) {
            rawPhone = rawPhone.substring(0, 13);
        }

        const waUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(rawMessage)}`;

        window.open(waUrl, '_blank');
    }

    // Group operations
    markGroupAsPaid(event: { date: string, cpf: string, paymentType: 'Nubank' | 'PicPay' }): void {
        this.dataService.markGroupAsPaid(event.date, event.cpf, event.paymentType).subscribe({
            next: () => this.loadData(),
            error: (error) => console.error('Error marking group as paid:', error)
        });
    }

    markGroupAsSent(event: { date: string, cpf: string }): void {
        this.dataService.markGroupAsSent(event.date, event.cpf).subscribe({
            next: () => {
                this.stateService.setSelectedTab('completed');
                this.loadData();
            },
            error: (error) => console.error('Error marking group as sent:', error)
        });
    }

    markGroupAsDeleted(event: { date: string, cpf: string }): void {
        this.dataService.markGroupAsDeleted(event.date, event.cpf).subscribe({
            next: () => this.loadData(),
            error: (error) => console.error('Error marking group as deleted:', error)
        });
    }

    returnGroupToOpen(event: { date: string, cpf: string }): void {
        this.dataService.returnGroupToOpen(event.date, event.cpf).subscribe({
            next: () => {
                this.stateService.setSelectedTab('open');
                this.loadData();
            },
            error: (error) => console.error('Error returning group to open:', error)
        });
    }

    // Tracking dialog
    openTrackingDialog(event: { date: string, cpf: string }): void {
        this.stateService.openTrackingDialog(event.date, event.cpf);
    }

    cancelTracking(): void {
        this.stateService.cancelTracking();
    }

    confirmTracking(): void {
        const date = this.stateService.getSelectedGroupDate();
        const cpf = this.stateService.getSelectedClientForTracking();
        const trackingCode = this.stateService.getTrackingCode();

        if (!date || !cpf || date === '' || cpf === '') return;

        // First mark as sent
        this.dataService.markGroupAsSent(date, cpf).subscribe({
            next: () => {
                // Then update tracking code if provided
                if (trackingCode.trim()) {
                    this.dataService.updateGroupTrackingCode(date, cpf, trackingCode).subscribe({
                        next: () => {
                            this.stateService.cancelTracking();
                            this.stateService.setSelectedTab('completed');
                            this.loadData();
                        },
                        error: (error) => console.error('Error updating tracking code:', error)
                    });
                } else {
                    this.stateService.cancelTracking();
                    this.stateService.setSelectedTab('completed');
                    this.loadData();
                }
            },
            error: (error) => console.error('Error marking group as sent:', error)
        });
    }

    // Navigation
    gotToNewPurchase(): void {
        this.router.navigate(['/cadastro-compras']);
    }

    // Getters for template
    getFilteredClients(): ClientPendencies[] {
        return this.dataService.getFilteredClients(
            this.stateService.getSelectedTab(),
            this.stateService.getFilter()
        );
    }

    getOpenCount(): number {
        return this.dataService.getOpenCount();
    }

    getSentCount(): number {
        return this.dataService.getSentCount();
    }

    getCompletedCount(): number {
        return this.dataService.getCompletedCount();
    }
}