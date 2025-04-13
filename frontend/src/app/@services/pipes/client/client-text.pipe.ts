import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clientTextFilter',
  standalone: true
})
export class ClientTextPipe implements PipeTransform {
  transform(clients: any[], term: string): any[] {
    if (!clients) return [];

    const lowerTerm = (term || '').trim().toLowerCase();

    return clients.filter(client =>
      `${client.name} ${client.cpf}`.toLowerCase().includes(lowerTerm)
    );
  }
}
