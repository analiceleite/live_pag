import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center min-h-screen">
      <div class="flex flex-col items-center gap-3">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="text-gray-600 font-medium">{{ message }}</p>
      </div>
    </div>
  `
})
export class LoadingComponent {
  @Input() message: string = 'Carregando...';
}
