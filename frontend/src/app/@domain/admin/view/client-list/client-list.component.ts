import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientApi } from '../../../../@services/api/client.api';
import { FormsModule } from '@angular/forms';
import { ClientTextFilterPipe } from '../../../../@services/pipes/clientTextFilter.pipe';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, FormsModule, ClientTextFilterPipe, BackToMenuComponent],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent {
  clients: any[] = [];  
  filter: string = '';  
  showDeleteModal: boolean = false;  
  showEditModal: boolean = false;   
  clientToDelete: any = null;      
  clientToEdit: any = { name: '', instagram: '', cpf: '', phone: '', zip_code: '', address: '', reference_point: '' };  

  constructor(private clientService: ClientApi) {}

  ngOnInit(): void {
    this.clientService.client$.subscribe((clients) => {
      this.clients = clients;
    });

    this.clientService.getAll();
  }

  editClient(client: any) {
    this.clientToEdit = { ...client };
    this.showEditModal = true;  
  }

  closeEditModal() {
    this.showEditModal = false; 
  }

  updateClient() {
    this.clientService.edit(this.clientToEdit.id, this.clientToEdit).subscribe(() => {
      this.closeEditModal();
    });
  }

  deleteClient(client: any) {
    this.clientToDelete = client;  
    this.showDeleteModal = true;   
  }

  closeDeleteModal() {
    this.showDeleteModal = false; 
  }

  confirmDelete() {
    if (this.clientToDelete) {
      this.clientService.delete(this.clientToDelete.id).subscribe(() => {
        this.closeDeleteModal(); 
      });
    }
  }
}
