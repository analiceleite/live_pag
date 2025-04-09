import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApi } from '../../../../@services/api/client.api';
import { FormsModule } from '@angular/forms';
import { ClientViewPipe } from '../../../../@services/pipes/clientView.pipe';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, FormsModule, ClientViewPipe, BackToMenuComponent],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent {
  clientes: any[] = [];
  filtro: string = '';

  constructor(private clientService: ClientApi) {}

  ngOnInit(): void {
    this.clientService.getAll().subscribe({
      next: (res: any) => (this.clientes = res),
      error: (err: any) => console.error('Erro ao carregar clientes:', err),
    });
  }
}
