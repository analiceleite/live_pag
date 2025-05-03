import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './modal-edit.component.html',
  providers: [provideNgxMask()],
  styleUrl: './modal-edit.component.scss'
})
export class ModalEditComponent {
  @Input() visible: boolean = false;
  @Input() loading: boolean = false;
  @Input() client: any = null; 

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<any>(); 
}
