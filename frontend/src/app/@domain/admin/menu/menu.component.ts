import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  logout() {
    localStorage.removeItem('role');
    window.location.reload();
  }
}
