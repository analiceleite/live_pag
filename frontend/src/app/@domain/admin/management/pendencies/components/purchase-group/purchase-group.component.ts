import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClientPendencies, PurchaseGroup, PurchaseTab } from '../../../../../../@services/models/purchase.interface';

@Component({
  selector: 'app-purchase-group',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './purchase-group.component.html'
})
export class PurchaseGroupComponent {
  @Input() group!: PurchaseGroup;
  @Input() client!: ClientPendencies;
  @Input() selectedTab: PurchaseTab = 'open';

  @Output() toggleGroup = new EventEmitter<PurchaseGroup>();
  @Output() markAsPaid = new EventEmitter<{ date: string, cpf: string, paymentType: 'Nubank' | 'PicPay' }>();
  @Output() markAsSent = new EventEmitter<{ date: string, cpf: string }>();
  @Output() markAsDeleted = new EventEmitter<{ date: string, cpf: string }>();
  @Output() returnToOpen = new EventEmitter<{ date: string, cpf: string }>();
  @Output() openTrackingDialog = new EventEmitter<{ date: string, cpf: string }>();

  toggleGroupExpand(event: Event, group: PurchaseGroup): void {
    event.stopPropagation();
    this.toggleGroup.emit(group);
  }

  togglePaymentOptions(event: Event): void {
    event.stopPropagation();
    this.group.showPaymentOptions = !this.group.showPaymentOptions;
  }

  toggleDeleteOption(event: Event): void {
    event.stopPropagation();
    this.group.showDeleteOption = !this.group.showDeleteOption;
  }

  onMarkAsPaid(date: string, cpf: string, paymentType: 'Nubank' | 'PicPay'): void {
    this.group.showPaymentOptions = false;
    this.markAsPaid.emit({ date, cpf, paymentType });
  }

  onMarkAsSent(date: string, cpf: string): void {
    this.markAsSent.emit({ date, cpf });
  }

  onMarkAsDeleted(date: string, cpf: string): void {
    this.group.showDeleteOption = false;
    this.markAsDeleted.emit({ date, cpf });
  }

  onReturnToOpen(date: string, cpf: string): void {
    this.returnToOpen.emit({ date, cpf });
  }

  onOpenTrackingDialog(date: string, cpf: string): void {
    this.openTrackingDialog.emit({ date, cpf });
  }

  hasDeliveryRequested(group: PurchaseGroup): boolean {
    return group.purchases.some(p => p.is_delivery_asked);
  }
}
