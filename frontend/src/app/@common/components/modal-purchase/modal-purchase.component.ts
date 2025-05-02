import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PurchaseService } from '../../../@services/api/purchase/purchase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClothingApi } from '../../../@services/api/shared/clothing.api';

@Component({
  selector: 'app-modal-purchase',
  templateUrl: './modal-purchase.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./modal-purchase.component.scss']
})
export class PurchaseModalComponent {
  @Input() show = false;
  @Input() client: any;
  @Input() available_clothings: any[] = [];
  
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  selected_clothings: any[] = [];
  search_term = '';
  is_loading = false;
  success_message = '';
  error_message = '';

  ngOnInit() {
    this.loadAvailableClothings();
  }

  constructor(private purchaseService: PurchaseService, private clothingService: ClothingApi) { }

  get filtered_clothings() {
    const term = this.search_term?.toLowerCase() || '';
    return this.available_clothings.filter(c =>
      c.name.toLowerCase().includes(term) || c.id.toString().includes(term)
    );
  }

  toggleClothingSelection(clothing: any) {
    const index = this.selected_clothings.findIndex(item => item.id === clothing.id);
    index === -1 ? this.selected_clothings.push(clothing) : this.selected_clothings.splice(index, 1);
  }

  isClothingSelected(clothing: any): boolean {
    return this.selected_clothings.some(item => item.id === clothing.id);
  }

  removeClothing(clothing: any) {
    const index = this.selected_clothings.findIndex(item => item.id === clothing.id);
    if (index !== -1) this.selected_clothings.splice(index, 1);
  }

  getTotalSelectedClothingsPrice(): string {
    const total = this.selected_clothings.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const discount = parseFloat(item.discount) || 0;
      return sum + (price - discount);
    }, 0);
    return total.toFixed(2).replace('.', ',');
  }

  closeModal() {
    this.close.emit();
    this.reset();
  }

  private reset() {
    this.success_message = '';
    this.error_message = '';
    this.selected_clothings = [];
    this.search_term = '';
    this.is_loading = false;
  }

  registerPurchase() {
    if (this.selected_clothings.length === 0) {
      this.error_message = 'Nenhuma peça selecionada.';
      return;
    }

    const clothing_ids = this.selected_clothings.map(c => c.id);
    this.is_loading = true;

    this.purchaseService.createPurchase(this.client.id, clothing_ids).subscribe({
      next: () => {
        this.success_message = 'Compra registrada com sucesso e adicionada a sacolinha da cliente!';
        this.refresh.emit();
        setTimeout(() => this.closeModal(), 2000);
      },
      error: (err) => this.error_message = this.getErrorMessage(err),
      complete: () => this.is_loading = false
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) return 'Cliente ou peça não encontrada.';
    if (error.status === 400) return 'Essas peças já foram vendidas.';
    return 'Erro ao registrar a compra.';
  }

  private loadAvailableClothings() {
    this.is_loading = true;
    this.clothingService.getAvailable().subscribe({
      next: (data: any) => {
        this.available_clothings = data;
        this.error_message = '';
      },
      error: (err) => {
        this.error_message = 'Erro ao carregar as peças disponíveis.';
      },
      complete: () => {
        this.is_loading = false;
      }
    });
  }

}
