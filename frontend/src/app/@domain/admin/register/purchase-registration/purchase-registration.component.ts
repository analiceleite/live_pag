import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PurchaseApi } from '../../../../@services/api/purchase.api';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';
@Component({
  selector: 'app-purchase-registration',
  imports: [CommonModule, FormsModule, BackToMenuComponent],
  templateUrl: './purchase-registration.component.html',
})
export class PurchaseRegistrationComponent {
  clienteId!: number;
  pecasInput = '';
  mensagem = '';

  constructor(private purshaseService: PurchaseApi) {}

  cadastrar() {
    const pecas = this.pecasInput.split(',').map(id => Number(id.trim()));
    this.purshaseService.create(this.clienteId, pecas).subscribe(() => {
      this.mensagem = 'Compra registrada com sucesso!';
      this.clienteId = 0;
      this.pecasInput = '';
    });
  }
}
