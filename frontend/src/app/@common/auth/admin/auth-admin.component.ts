import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-admin.component.html',
})
export class AuthAdminComponent {
  username = '';
  password = '';
  cpf = '';
  error = '';

  constructor(private router: Router) { }

  login() {

    if (this.username === 'admin' && this.password === 'admin') {
      localStorage.setItem('role', 'admin');
      this.router.navigate(['/menu']);
    } else {
      this.error = 'Usuário ou senha inválidos';
    }

  }
}
