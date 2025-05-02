import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ClientApi } from '../../../../@services/api/client/client.api';
import { ClientTextPipe } from '../../../../@services/pipes/client/client-text.pipe';

import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';
import { ModalDeleteComponent } from '../../../../@common/components/modal-delete/modal-delete.component';
import { ModalEditComponent } from '../../../../@common/components/modal-edit/modal-edit.component';
import { PurchaseModalComponent } from '../../../../@common/components/modal-purchase/modal-purchase.component';
import { PurchaseApi } from '../../../../@services/api/purchase/purchase.api';
import { ClothingApi } from '../../../../@services/api/shared/clothing.api';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    ClientTextPipe,
    BackToMenuComponent,
    ModalDeleteComponent,
    ModalEditComponent,
    PurchaseModalComponent
  ],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];
  filter: string = '';
  showDeleteModal: boolean = false;
  showEditModal: boolean = false;
  clientToDelete: any = null;
  clientToEdit: any = { name: '', instagram: '', cpf: '', phone: '', zip_code: '', address: '', reference_point: '' };
  isLoading: boolean = false;
  isLoadingAction: boolean = false;

  showPurchaseModal = false;
  selectedClient: any = null;
  availableClothings: any[] = [];
  selectedClothings: any[] = [];
  searchTerm = '';
  success_message = '';
  error_message = ''

  openedMenuId: number | null = null;

  constructor(private clientService: ClientApi, private clotingService: ClothingApi, private purchaseService: PurchaseApi, private router: Router) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.clientService.client$.subscribe((clients) => {
      this.clients = clients;
      this.isLoading = false;
    });
    this.clientService.getAll();
  }

  openPurchaseModal(client: any) {
    this.selectedClient = client;
    this.showPurchaseModal = true;
  }

  closePurchaseModal() {
    this.showPurchaseModal = false;
    this.selectedClient = null;
  }

  openEditModal(client: any) {
    this.clientToEdit = { ...client };
    this.showEditModal = true;
  }

  editClient() {
    this.isLoadingAction = true;
    this.clientService.edit(this.clientToEdit.id, this.clientToEdit).subscribe(() => {
      this.isLoadingAction = false;
      this.closeEditModal();
    });
  }

  deleteClient(client: any) {
    this.clientToDelete = client;
    this.showDeleteModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    if (this.clientToDelete) {
      this.isLoadingAction = true;
      this.clientService.delete(this.clientToDelete.id).subscribe(() => {
        this.isLoadingAction = false;
        this.closeDeleteModal();
      });
    }
  }

  gotToNewClient(): void {
    this.router.navigate(['/cadastro-clientes']);
  }

  toggleMenu(clientId: number) {
    this.openedMenuId = this.openedMenuId === clientId ? null : clientId;
  }
}
