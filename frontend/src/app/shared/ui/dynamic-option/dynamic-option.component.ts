import { Component, Input, output } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-option',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './dynamic-option.component.html',
  styleUrl: './dynamic-option.component.scss'
})
export class DynamicOptionComponent {
  @Input() index = 0;
  @Input() value = '';
  remove = output<void>();
  blur = output<number>();
}
