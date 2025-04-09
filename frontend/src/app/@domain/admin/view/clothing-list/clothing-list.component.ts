import { Component } from '@angular/core';
import { ClothingApi } from '../../../../@services/api/clothing.api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClothingFilterPipe } from '../../../../@services/pipes/clothingFilter.pipe';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-clothing-list',
  imports: [CommonModule, FormsModule, ClothingFilterPipe, BackToMenuComponent],
  templateUrl: './clothing-list.component.html'
})
export class ClothingListComponent {
  pecas: any[] = [];
  filtro: string = '';

  constructor(private clothingService: ClothingApi) {}

  ngOnInit(): void {
    this.clothingService.getAll().subscribe({
      next: (res: any) => (this.pecas = res),
      error: (err: any) => console.error('Erro ao carregar peças:', err),
    });
  }
}
