import { Component } from '@angular/core';
import { ClothingApi } from '../../../../@services/api/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClothingFilterPipe } from '../../../../@services/pipes/clothingFilter.pipe';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  imports: [FormsModule, CommonModule, ClothingFilterPipe, BackToMenuComponent],
  selector: 'app-clothing-list',
  templateUrl: './clothing-list.component.html',
})
export class ClothingListComponent {
  clothings: any[] = [];
  filter: string = '';
  showDeleteModal: boolean = false;
  showEditModal: boolean = false;
  pieceToDelete: any = null;
  pieceToEdit: any = null;

  constructor(private clothingService: ClothingApi) {}

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
}
