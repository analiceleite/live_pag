import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'miningFilter',
    standalone: true
})
export class MiningFilterPipe implements PipeTransform {
    transform(minings: any[], term: string): any[] {
        if (!minings) return [];
        if (!term) return minings;

        term = term.toLowerCase();
        return minings.filter(mining =>
            mining.client?.toLowerCase().includes(term)
        );
    }
}
