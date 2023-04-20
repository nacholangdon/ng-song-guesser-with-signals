import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() value = '';
  @Input() classes = '';
  @Input() isDisabled = false;
  @Input() style: '' | 'none' | 'full' = '';
  @Input() inputType: 'button' | 'submit' = 'button';

  @Output() onClick: EventEmitter<boolean> = new EventEmitter();

  onButtonClick(): void {
    if (this.inputType === 'button') {
      this.onClick.emit(true);
    }
  }
}
