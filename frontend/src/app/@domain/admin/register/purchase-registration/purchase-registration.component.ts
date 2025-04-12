import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PurchaseApi } from '../../../../@services/api/purchase.api';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-purchase-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, BackToMenuComponent],
  templateUrl: './purchase-registration.component.html',
})
export class PurchaseRegistrationComponent {
  client_id: number | null = null;
  clothings_input = '';
  success_message = '';
  error_message = '';
  isLoading = false;

  constructor(private purchaseService: PurchaseApi) {}

  registerPurchase() {
    // Reset messages
    this.success_message = '';
    this.error_message = '';

    // Validate client ID
    if (!this.client_id || this.client_id <= 0) {
      this.error_message = 'Por favor, informe um ID de cliente válido';
      return;
    }

    // Validate clothing IDs
    if (!this.clothings_input.trim()) {
      this.error_message = 'Por favor, informe os IDs das peças';
      return;
    }

    const clothings = this.clothings_input
      .split(',')
      .map(id => Number(id.trim()))
      .filter(id => !isNaN(id));

    if (clothings.length === 0) {
      this.error_message = 'Nenhum ID de peça válido foi informado';
      return;
    }

    this.isLoading = true;

    this.purchaseService.create(this.client_id, clothings).subscribe({
      next: () => {
        this.success_message = 'Compra registrada com sucesso!';
        this.resetForm();
      },
      error: (error) => {
        this.error_message = this.getErrorMessage(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private resetForm() {
    this.client_id = null;
    this.clothings_input = '';
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return 'Cliente ou peça não encontrada. Verifique os IDs informados.';
    }
    if (error.status === 400) {
      return 'Dados inválidos. Verifique as informações fornecidas.';
    }
    return 'Ocorreu um erro ao registrar a compra. Tente novamente.';
  }
}
