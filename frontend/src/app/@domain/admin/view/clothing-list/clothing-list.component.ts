import { Component } from '@angular/core';
import { ClothingApi } from '../../../../services/api/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clothing-list',
  imports: [CommonModule],
  templateUrl: './clothing-list.component.html'
})
export class ClothingListComponent {
  pecas: any[] = [];

  constructor(private clothingService: ClothingApi) {}

  ngOnInit(): void {
    this.clothingService.getAll().subscribe({
      next: (res: any) => (this.pecas = res),
      error: (err: any) => console.error('Erro ao carregar peças:', err),
    });
  }
}
