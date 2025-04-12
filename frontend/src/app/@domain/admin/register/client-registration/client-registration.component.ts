import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientApi } from '../../../../@services/api/api.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { BackToMenuComponent } from '../../../../@common/components/back-to-menu/back-to-menu.component';

@Component({
  selector: 'app-client-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective, BackToMenuComponent],
  providers: [provideNgxMask()],
  templateUrl: './client-registration.component.html',
})
export class ClientRegistrationComponent {
  name = '';
  cpf = '';
  instagram = '';
  phone = '';
  zip_code = '';
  address = '';
  reference_point = '';
  message = '';

  constructor(private clientService: ClientApi) {}

  register() {
    const newClient = {
      name: this.name,
      cpf: this.cpf,
      instagram: this.instagram,
      phone: this.phone,
      zip_code: this.zip_code,
      address: this.address,
      reference_point: this.reference_point,
    };

    this.clientService.add(newClient).subscribe(() => {
      this.message = 'Cliente cadastrado com sucesso!';

      // Clear form fields after successful registration
      this.name = '';
      this.cpf = '';
      this.instagram = '';
      this.phone = '';
      this.zip_code = '';
      this.address = '';
      this.reference_point = '';
    });
  }
}
