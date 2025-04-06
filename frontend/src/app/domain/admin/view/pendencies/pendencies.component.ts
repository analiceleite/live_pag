import { Component } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pendencies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pendencies.component.html',
})
export class PendenciesComponent {
  pendencias: any[] = [];
  clienteSelecionadoId: number | null = null;

  constructor(private apiService: ApiService) {
    this.carregarPendencias();
  }

  carregarPendencias() {
    this.apiService.getPendenciasAdmin().subscribe({
      next: (res: any[]) => {
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
      error: (err) => {
        console.error('Erro ao carregar pendências:', err);
      },
    });
  }

  selecionarCliente(clienteId: number) {
    this.clienteSelecionadoId = this.clienteSelecionadoId === clienteId ? null : clienteId;
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

    // Ordena as compras da mais recente para a mais antiga
    return Object.values(agrupado).sort((a, b) => new Date(b[0].data).getTime() - new Date(a[0].data).getTime());
  }
}
