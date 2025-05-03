import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClientPendencies, PurchaseGroup, PurchaseTab } from '../../../../../../@services/models/purchase.interface';
import { PurchaseGroupComponent } from '../purchase-group/purchase-group.component';
import { PixKey } from '../../../../../../@services/api/shared/pix-key.service';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    PurchaseGroupComponent
  ],
  templateUrl: './client-card.component.html'
})
export class ClientCardComponent {
  @Input() client!: ClientPendencies;
  @Input() selectedTab: PurchaseTab = 'open';
  @Input() selectedClientCpf: string | null = null;
  @Input() pixKeys: PixKey[] = [];

  @Output() toggleClient = new EventEmitter<string>();
  @Output() sendWhatsApp = new EventEmitter<ClientPendencies>();
  @Output() toggleGroup = new EventEmitter<{ client: ClientPendencies, group: any }>();
  @Output() markGroupAsPaid = new EventEmitter<{ date: string, cpf: string, paymentType: 'Nubank' | 'PicPay' }>();
  @Output() markGroupAsSent = new EventEmitter<{ date: string, cpf: string }>();
  @Output() markGroupAsDeleted = new EventEmitter<{ date: string, cpf: string }>();
  @Output() returnGroupToOpen = new EventEmitter<{ date: string, cpf: string }>();
  @Output() openTrackingDialog = new EventEmitter<{ date: string, cpf: string }>();
  @Output() pixKeySelected = new EventEmitter<{ group: PurchaseGroup; key: PixKey }>();

  onToggleClient(cpf: string): void {
    this.toggleClient.emit(cpf);
  }

  onSendWhatsApp(): void {
    if (this.client.purchase_groups) {
      const groupWithPix = this.client.purchase_groups.find(g => g.selectedPixKey);
      if (groupWithPix?.selectedPixKey) {
        this.client.selectedPixKey = groupWithPix.selectedPixKey;
      }
    }

    this.sendWhatsApp.emit(this.client);
  }
  onToggleGroup(group: any): void {
    this.toggleGroup.emit({ client: this.client, group });
  }

  onMarkGroupAsPaid(event: { date: string, cpf: string, paymentType: 'Nubank' | 'PicPay' }): void {
    this.markGroupAsPaid.emit(event);
  }

  onMarkGroupAsSent(event: { date: string, cpf: string }): void {
    this.markGroupAsSent.emit(event);
  }

  onMarkGroupAsDeleted(event: { date: string, cpf: string }): void {
    this.markGroupAsDeleted.emit(event);
  }

  onReturnGroupToOpen(event: { date: string, cpf: string }): void {
    this.returnGroupToOpen.emit(event);
  }

  onOpenTrackingDialog(event: { date: string, cpf: string }): void {
    this.openTrackingDialog.emit(event);
  }

  onGroupPixKeySelected(event: { group: PurchaseGroup; key: PixKey }): void {
    this.client.selectedPixKey = event.key;
    console.log('Selected Pix Key:', event.key);
  }

  getTotalAmount(client: ClientPendencies): number {
    return client.total_amount;
  }

  hasDeliveryRequested(client: ClientPendencies): boolean {
    return client.delivery_requested === true;
  }

  hasDeliverySent(client: ClientPendencies): boolean {
    return client.purchase_groups.some((group) => group.is_delivery_sent);
  }

  getTrackingCode(client: ClientPendencies): string {
    const group = client.purchase_groups.find((group) => group.is_delivery_sent);
    return group ? group.tracking_code || '' : '';
  }
}
