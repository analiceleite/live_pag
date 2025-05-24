import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PixKey } from '../../../../../../@services/api/shared/pix-key.service';
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
export class PurchaseGroupComponent implements OnInit {
  @Input() group!: PurchaseGroup;
  @Input() client!: ClientPendencies;
  @Input() selectedTab: PurchaseTab = 'open';
  @Input() pixKeys: PixKey[] = [];
  @Input() allPixKeys: { purchase_id: number, pix_key_id: number | null, pix_key_value: string | null }[] = [];

  @Output() toggleGroup = new EventEmitter<PurchaseGroup>();
  @Output() markAsPaid = new EventEmitter<{ date: string, cpf: string, paymentType: 'Nubank' | 'PicPay' }>();
  @Output() markAsSent = new EventEmitter<{ date: string, cpf: string }>();
  @Output() markAsDeleted = new EventEmitter<{ date: string, cpf: string }>();
  @Output() returnToOpen = new EventEmitter<{ date: string, cpf: string }>();
  @Output() openTrackingDialog = new EventEmitter<{ date: string, cpf: string }>();
  @Output() pixKeySelected = new EventEmitter<{ group: PurchaseGroup; key: PixKey }>();
  @Output() pixKeyUpdated = new EventEmitter<PixKey>();

  ngOnInit(): void {
    console.log('Grupo recebido:', this.group);
    console.log('Compras dentro do grupo:', this.group?.purchases);
    console.log('allPixKeys recebido:', this.allPixKeys);
    
    // Inicializa a chave selecionada com base nos dados do backend
    this.initializeSelectedKey();
  }

  private initializeSelectedKey(): void {
    if (!this.group?.purchases?.length) return;

    // Procura por uma chave específica já associada
    const associatedKey = this.allPixKeys.find(pk => 
      this.group.purchases.some(p => p.id === pk.purchase_id) && 
      pk.pix_key_value !== null
    );

    if (associatedKey) {
      const matchingPixKey = this.pixKeys.find(pk => pk.key === associatedKey.pix_key_value);
      if (matchingPixKey) {
        this.group.selectedPixKey = matchingPixKey;
      }
    }
  }

  getUsedPixKeyValue(purchaseId: number): string | null {
    if (!purchaseId) return null;

    // Procura pela chave específica desta compra
    const pixKeyInfo = this.allPixKeys.find(pk => 
      pk.purchase_id === purchaseId && 
      pk.pix_key_value !== null
    );

    if (pixKeyInfo?.pix_key_value) {
      console.log(`Usando chave específica da compra ${purchaseId}:`, pixKeyInfo.pix_key_value);
      return pixKeyInfo.pix_key_value;
    }

    // Se não encontrou chave específica, usa a chave principal
    const mainKey = this.pixKeys.find(key => key.main);
    if (mainKey?.key) {
      console.log('Usando chave principal:', mainKey.key);
      return mainKey.key;
    }

    return null;
  }

  isSpecificKey(pixKey: string, purchaseId: number): boolean {
    return this.allPixKeys.some(pk => 
      pk.purchase_id === purchaseId && 
      pk.pix_key_value === pixKey
    );
  }

  onSelectPixKey(purchaseId: number, pixKey: PixKey): void {
    // Atualiza apenas para a compra específica
    const index = this.allPixKeys.findIndex(pk => pk.purchase_id === purchaseId);
    if (index !== -1) {
      this.allPixKeys[index] = {
        purchase_id: purchaseId,
        pix_key_id: pixKey.id,
        pix_key_value: pixKey.key
      };
    } else {
      this.allPixKeys.push({
        purchase_id: purchaseId,
        pix_key_id: pixKey.id,
        pix_key_value: pixKey.key
      });
    }

    this.group.showPixOptions = false;
    this.pixKeySelected.emit({ group: this.group, key: pixKey });
    console.log('Nova chave Pix selecionada para compra:', purchaseId, pixKey.key);
  }

  getCurrentPixKey(purchaseId: number): PixKey | undefined {
    const currentValue = this.getUsedPixKeyValue(purchaseId);
    return this.pixKeys.find(pk => pk.key === currentValue);
  }

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