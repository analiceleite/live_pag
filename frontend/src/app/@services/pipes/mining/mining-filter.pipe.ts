import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'miningFilter',
  standalone: true
})
export class MiningFilterPipe implements PipeTransform {
  transform(minings: any[], searchQuery: string): any[] {
    if (!minings || !searchQuery) {
      return minings;
    }

    searchQuery = searchQuery.toLowerCase();

    return minings.filter(mining => {
      return (
        mining.quantity.toString().includes(searchQuery) ||
        mining.total_value.toString().includes(searchQuery) ||
        (mining.notes && mining.notes.toLowerCase().includes(searchQuery))
      );
    });
  }
}
