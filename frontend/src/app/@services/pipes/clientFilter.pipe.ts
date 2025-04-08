import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroClientes',
  standalone: true
})
export class ClientFilterPipe implements PipeTransform {
  transform(clientes: any[], termo: string, aba: 'aberto' | 'pagas'): any[] {
    termo = termo.trim().toLowerCase();

    return clientes
      .map(cliente => {
        // Separa as compras de acordo com a aba (pagas ou não pagas)
        const comprasFiltradas = cliente.compras.filter((c: { pago: any; }) => {
          return aba === 'aberto' ? !c.pago : c.pago;
        });

        if (comprasFiltradas.length === 0) return null;

        const nomeOuCpf = `${cliente.cliente} ${cliente.cpf}`.toLowerCase();
        const correspondeFiltro = nomeOuCpf.includes(termo);

        return correspondeFiltro || termo === ''
          ? { ...cliente, compras: comprasFiltradas }
          : null;
      })
      .filter(Boolean);
  }
}
