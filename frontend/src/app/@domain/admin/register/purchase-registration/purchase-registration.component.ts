import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseApi } from '../../../../@services/api/purchase/purchase.api';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-purchase-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, BackToMenuComponent],
  templateUrl: './purchase-registration.component.html',
})
export class PurchaseRegistrationComponent implements OnInit {
  client_id: number | null = null;
  clothings_input = '';
  success_message = '';
  error_message = '';
  isLoading = false;

  constructor(private purchaseService: PurchaseApi) {}

  ngOnInit(): void {}

  registerPurchase() {
    this.success_message = '';
    this.error_message = '';

    if (!this.client_id || this.client_id <= 0) {
      this.error_message = 'Por favor, informe um ID de cliente válido';
      return;
    }

    if (!this.clothings_input.trim()) {
      this.error_message = 'Por favor, informe os IDs das peças';
      return;
    }

    // Converte a string de IDs das peças em um array de números
    const clothingIds = this.clothings_input
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id)); // Remove valores inválidos

    // Verifica se há IDs válidos
    if (clothingIds.length === 0) {
      this.error_message = "Por favor, insira IDs válidos para as peças.";
      return;
    }

    this.isLoading = true;

    this.purchaseService.createPurchase(this.client_id, clothingIds).subscribe({
      next: () => {
        this.success_message = 'Compra registrada com sucesso!';
        this.resetForm();
      },
      error: (error: any) => {
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
      return 'Eessas peças já foram vendidas. Verifique as informações fornecidas.';
    }
    return 'Ocorreu um erro ao registrar a compra. Tente novamente.';
  }
}
