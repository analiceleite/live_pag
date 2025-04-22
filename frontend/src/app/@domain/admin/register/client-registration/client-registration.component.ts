import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ClientApi } from '../../../../@services/api/client/client.api';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-client-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    BackToMenuComponent,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  providers: [provideNgxMask()],
  templateUrl: './client-registration.component.html',
})
export class ClientRegistrationComponent implements OnInit {
  name = '';
  cpf = '';
  instagram = '';
  phone = '';
  zip_code = '';
  address = '';
  reference_point = '';
  success_message = '';
  error_message = '';
  isLoading = false;

  constructor(private clientService: ClientApi) {}

  ngOnInit(): void {}

  register() {
    this.success_message = '';
    this.error_message = '';

    // Verificar se os campos obrigatórios estão preenchidos
    if (!this.name || !this.cpf || !this.phone || !this.address) {
      this.error_message = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    const newClient = {
      name: this.name,
      cpf: this.cpf,
      instagram: this.instagram,
      phone: this.phone,
      zip_code: this.zip_code,
      address: this.address,
      reference_point: this.reference_point,
    };

    this.isLoading = true;

    this.clientService.add(newClient).subscribe({
      next: () => {
        this.success_message = 'Cliente cadastrado com sucesso!';
        this.error_message = '';
        this.resetForm();
      },
      error: (error: any) => {
        this.success_message = '';
        this.error_message = this.getErrorMessage(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private resetForm() {
    this.name = '';
    this.cpf = '';
    this.instagram = '';
    this.phone = '';
    this.zip_code = '';
    this.address = '';
    this.reference_point = '';
  }

  private getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Dados inválidos. Verifique as informações fornecidas.';
    }
    return 'Ocorreu um erro ao cadastrar o cliente. Tente novamente.';
  }
}
