import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ClothingApi } from '../../../../@services/api/shared/clothing.api';
import { ClothingFilterPipe } from '../../../../@services/pipes/clothing/clothing-filter.pipe';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-clothing-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    ClothingFilterPipe,
    BackToMenuComponent
  ],
  templateUrl: './clothing-list.component.html',
})
export class ClothingListComponent implements OnInit {
  clothings: any[] = [];
  filter: string = '';
  showDeleteModal: boolean = false;
  showEditModal: boolean = false;
  pieceToDelete: any = null;
  pieceToEdit: any = null;

  constructor(private clothingService: ClothingApi, private router: Router) {}

  ngOnInit() {
    this.getClothings();
  }

  getClothings() {
    this.clothingService.getAll().subscribe((data: any) => {
      this.clothings = data;
    });
  }

  openEditModal(piece: any) {
    this.pieceToEdit = { ...piece };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.pieceToEdit = null;
  }

  updateClothing() {
    if (this.pieceToEdit) {
      this.clothingService.update(this.pieceToEdit).subscribe(() => {
        this.getClothings();
        this.closeEditModal();
      });
    }
  }

  openDeleteModal(piece: any) {
    this.pieceToDelete = piece;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.pieceToDelete = null;
  }

  confirmDelete() {
    if (this.pieceToDelete) {
      this.clothingService.delete(this.pieceToDelete.id).subscribe(() => {
        this.getClothings();
        this.closeDeleteModal();
      });
    }
  }

  gotToNewClothing(): void {
    this.router.navigate(['/cadastro-pecas']);
  }
}
