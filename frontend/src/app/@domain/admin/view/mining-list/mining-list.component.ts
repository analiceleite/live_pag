import { Component, OnInit } from '@angular/core';
import { MiningApi } from '../../../../@services/api/mining.api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';
import { MiningFilterPipe } from '../../../../@services/pipes/miningFilter.pipe';

@Component({
  selector: 'app-mining-list',
  imports: [CommonModule, FormsModule, BackToMenuComponent, MiningFilterPipe],
  templateUrl: './mining-list.component.html'
})
export class MiningListComponent implements OnInit {
  minings: any[] = []; 
  searchQuery: string = ''; 
  successMessage: string = '';
  errorMessage: string = '';

  // Variáveis para controle do modal
  selectedMining: any = null;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  constructor(private miningApi: MiningApi, private router: Router) {}

  ngOnInit(): void {
    this.getMinings(); // Ao iniciar, carrega todos os garimpos cadastrados
  }

  // Método para buscar os garimpos cadastrados
  getMinings(): void {
    this.miningApi.getMining().subscribe({
      next: (data: any[]) => {
        this.minings = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar garimpos', err);
        this.errorMessage = 'Erro ao carregar os garimpos.';
      }
    });
  }

  // Método para excluir um garimpo
  deleteMining(id: number): void {
    this.miningApi.deleteMining(id).subscribe({
      next: () => {
        this.successMessage = 'Garimpo excluído com sucesso!';
        this.errorMessage = '';
        this.getMinings(); // Atualiza a lista após a exclusão
        this.showDeleteModal = false; // Fecha o modal de exclusão
      },
      error: (err: any) => {
        console.error('Erro ao excluir garimpo', err);
        this.successMessage = '';
        this.errorMessage = 'Erro ao excluir o garimpo.';
      }
    });
  }

  // Método para editar um garimpo
  editMining(id: number): void {
    this.selectedMining = this.minings.find(mining => mining.id === id);
    this.showEditModal = true; // Exibe o modal de edição
  }

  // Método para salvar as edições de um garimpo
  saveEditedMining(): void {
    const { id, quantity, total_value, notes } = this.selectedMining;
    this.miningApi.updateMining(id, quantity, total_value, notes).subscribe({
      next: () => {
        this.successMessage = 'Garimpo atualizado com sucesso!';
        this.errorMessage = '';
        this.getMinings(); // Atualiza a lista
        this.showEditModal = false; // Fecha o modal de edição
      },
      error: (err: any) => {
        console.error('Erro ao editar garimpo', err);
        this.successMessage = '';
        this.errorMessage = 'Erro ao editar o garimpo.';
      }
    });
  }

  // Método para cancelar a edição
  cancelEdit(): void {
    this.showEditModal = false; // Fecha o modal sem salvar
  }

  // Método para confirmar a exclusão
  confirmDelete(): void {
    if (this.selectedMining) {
      this.deleteMining(this.selectedMining.id);
    }
  }

  // Método para cancelar a exclusão
  cancelDelete(): void {
    this.showDeleteModal = false; // Fecha o modal de exclusão
  }
}
