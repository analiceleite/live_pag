import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-tracking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './tracking-dialog.component.html',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      state('*', style({
        opacity: 1
      })),
      transition(':enter', [
        animate('150ms ease-out')
      ]),
      transition(':leave', [
        animate('150ms ease-in')
      ])
    ])
  ]
})
export class TrackingDialogComponent {
  @Input() show: boolean = false;
  @Input() trackingCode: string = '';

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<string>();
  @Output() trackingCodeChange = new EventEmitter<string>();

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit(this.trackingCode);
  }

  onTrackingCodeChange(value: string): void {
    this.trackingCode = value;
    this.trackingCodeChange.emit(value);
  }
}
