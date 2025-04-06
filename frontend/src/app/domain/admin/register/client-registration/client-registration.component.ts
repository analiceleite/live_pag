import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-client-registration',
  imports: [CommonModule, FormsModule],
  templateUrl: './client-registration.component.html',
})
export class ClientRegistrationComponent {
  nome = '';
  cpf = '';
  mensagem = '';

  constructor(private api: ApiService) {}

  cadastrar() {
    this.api.addCliente(this.nome, this.cpf).subscribe(() => {
      this.mensagem = 'Cliente cadastrado com sucesso!';
      this.nome = '';
      this.cpf = '';
    });
  }
}
