import { Component } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent {
  clientes: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getClientes().subscribe({
      next: (res: any) => (this.clientes = res),
      error: (err) => console.error('Erro ao carregar clientes:', err),
    });
  }
}
