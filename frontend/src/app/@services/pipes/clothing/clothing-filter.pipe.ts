import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clothingFilter',
  standalone: true
})
export class ClothingFilterPipe implements PipeTransform {
  transform(items: any[], filter: string): any[] {
    if (!items || !filter) {
      return items;
    }

    filter = filter.toLowerCase();

    return items.filter(item => {
      return (
        item.name?.toLowerCase().includes(filter) ||
        item.queue_name?.toLowerCase().includes(filter) ||
        item.purchase_channel?.toLowerCase().includes(filter) ||
        item.purchase_type?.toLowerCase().includes(filter)
      );
    });
  }
}
