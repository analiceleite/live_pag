import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-clothing-registration',
  imports: [CommonModule, FormsModule],
  templateUrl: './clothing-registration.component.html',
})
export class ClothingRegistrationComponent {
  nome = '';
  preco!: number;
  mensagem = '';

  constructor(private api: ApiService) {}

  cadastrar() {
    this.api.addPeca(this.nome, this.preco).subscribe(() => {
      this.mensagem = 'Peça cadastrada com sucesso!';
      this.nome = '';
      this.preco = 0;
    });
  }
}
