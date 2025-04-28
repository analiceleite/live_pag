import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-version',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 text-sm text-gray-600 flex flex-col items-end">
      <div class="flex items-center gap-2">
        <span>v{{ version }}</span>
        <span class="w-2 h-2 rounded-full" 
              [ngClass]="{'bg-green-500': environment.production, 'bg-yellow-500': !environment.production}">
        </span>
      </div>
      <div class="text-xs mt-1">
        © {{ currentYear }} Analice Leite. Todos os direitos reservados.
      </div>
    </div>
  `,
  styles: [`
    :host {
      z-index: 50;
    }
  `]
})
export class VersionComponent {
  version: string = environment.version;
  environment = environment;
  currentYear: number = new Date().getFullYear();
}
