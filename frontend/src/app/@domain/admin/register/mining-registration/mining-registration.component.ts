import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MiningApi } from '../../../../@services/api/shared/mining.api';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  imports: [CommonModule, FormsModule, BackToMenuComponent],
  selector: 'app-mining-registration',
  templateUrl: './mining-registration.component.html',
})
export class MiningRegisterComponent implements OnInit {
  quantity: number = 0;
  total_value: number = 0;
  notes: string = '';

  success_message: string = '';
  error_message: string = '';

  constructor(private miningService: MiningApi) {}

  ngOnInit() {}

  registerMining() {
    this.miningService.createMining(this.quantity, this.total_value, this.notes).subscribe({
      next: () => {
        this.success_message = 'Garimpo cadastrado com sucesso!';
        this.error_message = '';
        this.quantity = 0;
        this.total_value = 0;
        this.notes = '';
      },
      error: (error) => {
        console.error('Erro ao cadastrar garimpo:', error);
        this.success_message = '';
        this.error_message = 'Erro ao cadastrar o garimpo.';
      },
    });
  }
}
