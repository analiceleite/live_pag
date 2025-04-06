import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-purchase-registration',
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-registration.component.html',
})
export class PurchaseRegistrationComponent {
  clienteId!: number;
  pecasInput = '';
  mensagem = '';

  constructor(private api: ApiService) {}

  cadastrar() {
    const pecas = this.pecasInput.split(',').map(id => Number(id.trim()));
    this.api.criarCompra(this.clienteId, pecas).subscribe(() => {
      this.mensagem = 'Compra registrada com sucesso!';
      this.clienteId = 0;
      this.pecasInput = '';
    });
  }
}
