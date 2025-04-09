import { Component } from '@angular/core';
import { PurchaseApi } from '../../../../@services/api/purchase.api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { PixApi } from '../../../../@services/api/pix.api';
import { ClientFilterPipe } from '../../../../@services/pipes/clientFilter.pipe';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-pendencies',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent, ClientFilterPipe, BackToMenuComponent],
  templateUrl: './pendencies.component.html',
})
export class PendenciesComponent {
  pendencias: any[] = [];
  clienteSelecionadoId: number | null = null;
  qrCodeValue: string = '';

  mostrarModalPix = false;
  clienteModal: any;

  filtro: string = '';
  abaSelecionada: 'aberto' | 'pagas' = 'aberto';

  constructor(private purchaseService: PurchaseApi, private pixService: PixApi) {
    this.carregarPendencias();
  }

  carregarPendencias() {
    this.purchaseService.getPendenciasAdmin().subscribe({
      next: (res: any) => {
        const agrupado: { [cpf: string]: any[] } = {};

        for (const item of res) {
          if (!agrupado[item.cpf]) {
            agrupado[item.cpf] = [];
          }
          agrupado[item.cpf].push(item);
        }

        this.pendencias = Object.entries(agrupado).map(([cpf, compras]: any) => ({
          id: compras[0].cpf,
          cliente: compras[0].cliente,
          cpf,
          compras
        }));
      },
      error: (err: any) => {
        console.error('Erro ao carregar pendências:', err);
      },
    });
  }

  selecionarCliente(clienteId: number) {
    this.clienteSelecionadoId = this.clienteSelecionadoId === clienteId ? null : clienteId;
    this.qrCodeValue = ''; 
  }

  totalCompra(pecas: any[]) {
    return pecas.reduce((total, p) => total + Number(p.preco), 0);
  }

  groupByCompra(compras: any[]) {
    const agrupado: { [compraId: string]: any[] } = {};
    for (const item of compras) {
      if (!agrupado[item.compra_id]) {
        agrupado[item.compra_id] = [];
      }
      agrupado[item.compra_id].push(item);
    }

    return Object.values(agrupado).sort((a, b) => new Date(b[0].data).getTime() - new Date(a[0].data).getTime());
  }

  gerarPix(cpf: string) {
    const cliente = this.pendencias.find(c => c.cpf === cpf);
    if (!cliente) return;

    const total = this.totalCompra(cliente.compras);

    this.pixService.gerarPix(total, cliente.cliente).subscribe({
      next: (res: { payload: string }) => {
        this.qrCodeValue = res.payload;
      },
      error: (err: any) => {
        console.error('Erro ao gerar Pix:', err);
      }
    });
  }

  marcarComoPaga(compraId: number) {
    this.purchaseService.markAsPaid(compraId).subscribe({
      next: () => {
        this.carregarPendencias();
        this.qrCodeValue = '';
      },
      error: (err: any) => {
        console.error('Erro ao marcar como paga:', err);
      }
    });
  }

  marcarComoNaoPaga(compraId: number) {
    this.purchaseService.markAsUnpaid(compraId).subscribe({
      next: () => {
        this.carregarPendencias();
      },
      error: (err: any) => {
        console.error('Erro ao desfazer:', err);
      }
    });
  }

  abrirModalPix(cliente: any) {
    this.clienteModal = cliente;
    this.gerarPix(cliente.cpf); 
    this.mostrarModalPix = true;
  }
  
  fecharModalPix() {
    this.mostrarModalPix = false;
    this.qrCodeValue = '';
  }
  
}
