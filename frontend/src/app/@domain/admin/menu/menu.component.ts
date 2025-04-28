import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, Version } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VersionComponent } from '../../../@common/components/version/version.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, VersionComponent],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  currentDate: Date = new Date();

  constructor() {}

  ngOnInit() {
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('lastAccess');
    window.location.reload();
  }
}
