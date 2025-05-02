import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VersionComponent } from '../../components/version/version.component';
import { AuthApi } from '../../../@services/api/auth/auth.api';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, VersionComponent],
  templateUrl: './auth-admin.component.html',
})
export class AuthAdminComponent {
  showPassword = false;
  username = '';
  password = '';
  error = '';

  constructor(private router: Router, private authService: AuthApi) { }

  login() {
    this.authService.loginAdmin(this.username, this.password).subscribe(
      (response) => {
        this.authService.setToken(response.token);
        localStorage.setItem('role', 'admin');
        this.router.navigate(['/menu']);
      },
      () => {
        this.error = 'Usuário ou senha inválidos';
      }
    );
  }
}
