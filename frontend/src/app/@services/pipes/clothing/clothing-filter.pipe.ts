import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clothingFilter',
  standalone: true
})
export class ClothingFilterPipe implements PipeTransform {

  transform(clothings: any[], term: string): any[] {
    if (!clothings) return [];
    if (!term) return clothings;

    term = term.toLowerCase();
    return clothings.filter(clothing =>
      clothing.piece_name?.toLowerCase().includes(term)
    );
  }
}
