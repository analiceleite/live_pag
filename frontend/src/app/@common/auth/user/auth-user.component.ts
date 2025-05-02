import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthApi } from '../../../@services/api/auth/auth.api';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { VersionComponent } from '../../components/version/version.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective, RouterModule, VersionComponent],
  providers: [provideNgxMask()],
  templateUrl: './auth-user.component.html',
})
export class AuthUserComponent {
  phone = '';
  error = '';

  constructor(private loginService: AuthApi, private router: Router) { }

  login() {
    this.loginService.login(this.phone).subscribe({
      next: (res: any) => {
        localStorage.setItem('role', res.role);
        localStorage.setItem('clientId', res.clientId);
        this.router.navigate(['/pendencias-cliente']);
        console.log('Login successful:', res);
      },
      error: () => {
        this.error = 'Telefone inválido';
      }
    });
  }
}

