import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApi } from '../../../../services/api/client.api';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent {
  clientes: any[] = [];

  constructor(private clientService: ClientApi) {}

  ngOnInit(): void {
    this.clientService.getAll().subscribe({
      next: (res: any) => (this.clientes = res),
      error: (err: any) => console.error('Erro ao carregar clientes:', err),
    });
  }
}
