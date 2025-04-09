import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientApi } from '../../../../@services/api/api.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-client-registration',
  imports: [CommonModule, FormsModule, NgxMaskDirective, BackToMenuComponent],
  providers: [provideNgxMask()],
  templateUrl: './client-registration.component.html',
})
export class ClientRegistrationComponent {
  nome = '';
  cpf = '';
  mensagem = '';

  constructor(private clientService: ClientApi) { }

  cadastrar() {
    this.clientService.add(this.nome, this.cpf).subscribe(() => {
      this.mensagem = 'Cliente cadastrado com sucesso!';
      this.nome = '';
      this.cpf = '';
    });
  }
}
