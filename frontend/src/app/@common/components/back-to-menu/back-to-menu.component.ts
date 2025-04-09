import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-back-to-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './back-to-menu.component.html'
})

export class BackToMenuComponent {
  constructor(private router: Router) {}

  voltarAoMenu() {
    this.router.navigate(['/menu']); 
  }
}
