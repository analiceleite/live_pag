import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyFormat'
})
export class CurrencyPipe implements PipeTransform {
    transform(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
} 