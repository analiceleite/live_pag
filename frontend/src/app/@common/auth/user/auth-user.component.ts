import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApi } from '../../../@services/api/api.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './auth-user.component.html',
})
export class AuthUserComponent {
  cpf = '';
  error = '';

  constructor(private loginService: AuthApi, private router: Router) { }

  login() {
    this.loginService.login(this.cpf).subscribe({
      next: (res: any) => {
        localStorage.setItem('role', res.role);
        localStorage.setItem('clienteId', res.clienteId);
        this.router.navigate(['/pendencias-cliente']);
        console.log('Login successful:', res);
      },
      error: () => {
        this.error = 'CPF inválido';
      }
    });
  }
}

