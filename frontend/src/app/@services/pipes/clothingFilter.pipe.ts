import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clothingFilter',
  standalone: true
})
export class ClothingFilterPipe implements PipeTransform {
  transform(pecas: any[], filtro: string): any[] {
    if (!pecas || !filtro) return pecas;

    const filtroLower = filtro.toLowerCase();

    return pecas.filter(peca =>
      peca.nome?.toLowerCase().includes(filtroLower) ||
      peca.id?.toString().includes(filtro)
    );
  }
}
