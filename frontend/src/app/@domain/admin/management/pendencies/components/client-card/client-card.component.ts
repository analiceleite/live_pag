import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClientPendencies, PurchaseTab } from '../../../../../../@services/models/purchase.interface';
import { PurchaseGroupComponent } from '../purchase-group/purchase-group.component';

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

  @Output() toggleClient = new EventEmitter<string>();
  @Output() sendWhatsApp = new EventEmitter<ClientPendencies>();
  @Output() toggleGroup = new EventEmitter<{ client: ClientPendencies, group: any }>();
  @Output() markGroupAsPaid = new EventEmitter<{ date: string, cpf: string, paymentType: 'Nubank' | 'PicPay' }>();
  @Output() markGroupAsSent = new EventEmitter<{ date: string, cpf: string }>();
  @Output() markGroupAsDeleted = new EventEmitter<{ date: string, cpf: string }>();
  @Output() returnGroupToOpen = new EventEmitter<{ date: string, cpf: string }>();
  @Output() openTrackingDialog = new EventEmitter<{ date: string, cpf: string }>();

  onToggleClient(cpf: string): void {
    this.toggleClient.emit(cpf);
  }

  onSendWhatsApp(client: ClientPendencies): void {
    this.sendWhatsApp.emit(client);
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
