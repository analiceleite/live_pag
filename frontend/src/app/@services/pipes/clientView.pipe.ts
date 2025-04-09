import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clientFilter',
  standalone: true
})
export class ClientViewPipe implements PipeTransform {
  transform(clientes: any[], filtro: string): any[] {
    if (!clientes || !filtro) return clientes;

    const filtroLower = filtro.toLowerCase();

    return clientes.filter(cliente =>
      cliente.nome?.toLowerCase().includes(filtroLower) ||
      cliente.cpf?.toString().includes(filtro)
    );
  }
}
