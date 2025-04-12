import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApi } from '../../../@services/api/api.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective, RouterModule],
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
        localStorage.setItem('clientId', res.clientId);
        this.router.navigate(['/pendencias-cliente']);
        console.log('Login successful:', res);
      },
      error: () => {
        this.error = 'CPF inválido';
      }
    });
  }
}

