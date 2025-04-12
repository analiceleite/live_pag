import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clothingFilter'
})
export class ClothingFilterPipe implements PipeTransform {

  transform(clothings: any[], filter: string): any[] {
    if (!filter) {
      return clothings;
    }

    filter = filter.toLowerCase();

    return clothings.filter(clothing => 
      (clothing.name && clothing.name.toLowerCase().includes(filter)) || 
      (clothing.price && clothing.price.toString().includes(filter)) ||
      (clothing.queue_name && clothing.queue_name.toLowerCase().includes(filter)) ||
      (clothing.purchase_channel && clothing.purchase_channel.toLowerCase().includes(filter)) ||
      (clothing.purchase_type && clothing.purchase_type.toLowerCase().includes(filter)) ||
      (clothing.discount && clothing.discount.toString().includes(filter))
    );
  }
}
