import { Component } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clothing-list',
  imports: [CommonModule],
  templateUrl: './clothing-list.component.html'
})
export class ClothingListComponent {
  pecas: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getPecas().subscribe({
      next: (res: any) => (this.pecas = res),
      error: (err: any) => console.error('Erro ao carregar peças:', err),
    });
  }
}
