import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clientTextFilter',
  standalone: true
})
export class ClientTextPipe implements PipeTransform {
  transform(items: any[], filter: string): any[] {
    if (!items || !filter) {
      return items;
    }

    filter = filter.toLowerCase();
    
    return items.filter(item => {
      return item.name?.toLowerCase().includes(filter) || 
             item.cpf?.toLowerCase().includes(filter) ||
             item.instagram?.toLowerCase().includes(filter) ||
             item.phone?.includes(filter);
    });
  }
}
