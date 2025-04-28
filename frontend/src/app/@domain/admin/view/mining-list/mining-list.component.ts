import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MiningApi } from '../../../../@services/api/shared/mining.api';
import { MiningFilterPipe } from '../../../../@services/pipes/mining/mining-filter.pipe';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mining-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MiningFilterPipe,
    BackToMenuComponent
  ],
  templateUrl: './mining-list.component.html'
})
export class MiningListComponent implements OnInit {
  minings: any[] = []; 
  searchQuery: string = ''; 
  successMessage: string = '';
  errorMessage: string = '';

  selectedMining: any = null;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  isLoading: boolean = false;

  constructor(private miningApi: MiningApi, private router: Router) {}

  ngOnInit(): void {
    this.getMinings(); 
  }

  getMinings(): void {
    this.isLoading = true;
    this.miningApi.getMining().subscribe({
      next: (data: any[]) => {
        this.minings = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar garimpos', err);
        this.errorMessage = 'Erro ao carregar os garimpos.';
        this.isLoading = false;
      }
    });
  }

  deleteMining(id: number): void {
    this.miningApi.deleteMining(id).subscribe({
      next: () => {
        this.successMessage = 'Garimpo excluído com sucesso!';
        this.errorMessage = '';
        this.getMinings(); 
        this.showDeleteModal = false; 
      },
      error: (err: any) => {
        console.error('Erro ao excluir garimpo', err);
        this.successMessage = '';
        this.errorMessage = 'Erro ao excluir o garimpo.';
      }
    });
  }

  editMining(id: number): void {
    this.selectedMining = this.minings.find(mining => mining.id === id);
    this.showEditModal = true; 
  }

  saveEditedMining(): void {
    const { id, quantity, total_value, notes } = this.selectedMining;
    this.miningApi.updateMining(id, quantity, total_value, notes).subscribe({
      next: () => {
        this.successMessage = 'Garimpo atualizado com sucesso!';
        this.errorMessage = '';
        this.getMinings(); 
        this.showEditModal = false; 
      },
      error: (err: any) => {
        console.error('Erro ao editar garimpo', err);
        this.successMessage = '';
        this.errorMessage = 'Erro ao editar o garimpo.';
      }
    });
  }

  cancelEdit(): void {
    this.showEditModal = false; 
  }

  confirmDelete(): void {
    if (this.selectedMining) {
      this.deleteMining(this.selectedMining.id);
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false; 
  }

  gotToNewMining(): void {
    this.router.navigate(['/cadastro-garimpo']);
  }
}
