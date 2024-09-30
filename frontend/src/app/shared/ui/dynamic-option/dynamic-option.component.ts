import { Component, Input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-dynamic-option',
  standalone: true,
  imports: [FormsModule, SvgIconComponent],
  templateUrl: './dynamic-option.component.html',
  styleUrl: './dynamic-option.component.scss'
})
export class DynamicOptionComponent {
  @Input() index = 0;
  @Input() value = '';
  remove = output<DynamicOptionComponent>();
  blur = output<DynamicOptionComponent>();
}
