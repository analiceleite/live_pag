import { Component, OnInit } from '@angular/core';
import { PixApi } from '../../../../@services/api/pix.api';
import { PurchaseApi } from '../../../../@services/api/purchase.api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-pendencies-user',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent],
  templateUrl: './pendencies-user.component.html'
})
export class PendenciesUserComponent implements OnInit {
  clienteLogado: any = null;
  qrCodeValue: string = '';
  mostrarQrCode = false;

  clienteModal: any = null; 
  mostrarModalPix = false;  

  constructor(
    private pixService: PixApi,
    private purchaseService: PurchaseApi
  ) { }

  ngOnInit() {
    const clienteId = Number(localStorage.getItem('clienteId'));

    if (!clienteId) {
      console.error('Invalid clienteId');
      return;
    }

    this.purchaseService.getPendenciasCliente(clienteId).subscribe((res: any[]) => {
      if (res.length > 0) {
        this.clienteLogado = {
          cliente: res[0].cliente,
          cpf: res[0].cpf,
          compras: res,
        };
        console.log("Compras do cliente: ", this.clienteLogado, res)
      }
    });

  }

  totalCompra(pecas: any[]) {
    return pecas
      .filter(p => !p.pago)
      .reduce((total, p) => total + Number(p.preco), 0);
  }

  groupByCompra(compras: any[]) {
    const agrupado: { [compraId: string]: any[] } = {};
    for (const item of compras) {
      if (!agrupado[item.compra_id]) {
        agrupado[item.compra_id] = [];
      }
      agrupado[item.compra_id].push(item);
    }
    return Object.values(agrupado).filter(grupo => !grupo[0].pago);
  }

  gerarPix() {
    if (!this.clienteLogado) return;

    const total = this.totalCompra(this.clienteLogado.compras);
    this.pixService.gerarPix(total, this.clienteLogado.cliente).subscribe({
      next: (res: { payload: string }) => {
        this.qrCodeValue = res.payload;
        this.clienteModal = this.clienteLogado;
        this.mostrarModalPix = true; 
      },
      error: (err: any) => {
        console.error('Erro ao gerar Pix:', err);
      }
    });
  }

  enviarComprovante() {
    const cliente = this.clienteLogado;
    const mensagem = `Olá! Sou ${cliente.cliente} e estou enviando o comprovante de pagamento das minhas compras em aberto.`;
    const link = `https://wa.me/+5547984957878?text=${encodeURIComponent(mensagem)}`;
    window.open(link, '_blank');
  }  

  fecharModalPix() {
    this.mostrarModalPix = false;
    this.qrCodeValue = '';
    this.clienteModal = null;
  }
}
