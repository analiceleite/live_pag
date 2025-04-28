import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [FormsModule, RouterModule],
  standalone: true,
  templateUrl: './not-found.component.html',})
export class NotFoundComponent {

}
