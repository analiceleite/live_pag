import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  tipo: 'admin' | 'usuario' = 'admin'; 
  username = '';
  password = '';
  cpf = '';
  error = '';

  constructor(private apiService: ApiService, private router: Router) { }

  login() {
    if (this.tipo === 'admin') {
      if (this.username === 'admin' && this.password === 'admin') {
        localStorage.setItem('role', 'admin');
        this.router.navigate(['/menu']);
      } else {
        this.error = 'Usuário ou senha inválidos';
      }
    } else if (this.tipo === 'usuario') {
      this.apiService.login(this.cpf).subscribe({
        next: (res: any) => {
          localStorage.setItem('role', res.role);
          localStorage.setItem('clienteId', res.clienteId);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.error = 'CPF inválido';
        }
      });
    }
  }
}
