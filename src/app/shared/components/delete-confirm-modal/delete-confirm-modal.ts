import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirm-modal.html',
  styleUrl: './delete-confirm-modal.css',
})
export class DeleteConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Delete Item';
  @Input() itemName = '';
  @Input() prompt = 'Delete this item?';
  @Input() warningText = 'This action cannot be undone.';
  @Input() confirmText = 'Delete';
  @Input() loading = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
