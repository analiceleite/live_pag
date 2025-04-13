import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClothingApi } from '../../../../@services/api/shared/clothing.api';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-clothing-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, BackToMenuComponent],
  templateUrl: './clothing-registration.component.html',
})
export class ClothingRegistrationComponent implements OnInit {
  piece_name = '';
  price!: number;
  queue_name = '';
  purchase_channel = '';
  purchase_type = '';
  discount = 0;
  message = '';
  errorMessage = '';

  constructor(private clothingService: ClothingApi) {}

  ngOnInit(): void {}

  registerPurchase() {
    if (!this.piece_name || !this.price || !this.purchase_channel || !this.purchase_type) {
      this.errorMessage = 'Preencha todos os campos obrigatórios.';
      setTimeout(() => {
        this.errorMessage = ''; 
      }, 3000);
      return;
    }

    const purchase = {
      name: this.piece_name,
      price: this.price,
      queue_name: this.queue_name,
      purchase_channel: this.purchase_channel,
      purchase_type: this.purchase_type,
      discount: this.discount || 0
    };

    this.clothingService.add(purchase).subscribe(() => {
      this.message = 'Compra cadastrada com sucesso!';
      setTimeout(() => {
        this.message = ''; 
      }, 3000);
      this.piece_name = '';
      this.price = 0;
      this.queue_name = '';
      this.purchase_channel = '';
      this.purchase_type = '';
      this.discount = 0;
    });
  }
}
