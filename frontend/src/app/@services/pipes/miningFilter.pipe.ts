import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'miningFilter'
})
export class MiningFilterPipe implements PipeTransform {

  transform(items: any[], searchQuery: string): any[] {
    if (!items) return [];
    if (!searchQuery) return items;
    
    searchQuery = searchQuery.toLowerCase();
    return items.filter(item => {
      return item.quantity.toString().toLowerCase().includes(searchQuery) ||
             item.total_value.toString().toLowerCase().includes(searchQuery) ||
             (item.notes && item.notes.toLowerCase().includes(searchQuery));
    });
  }
}
