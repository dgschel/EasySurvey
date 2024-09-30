import { Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-display-error-message',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './display-error-message.component.html',
  styleUrl: './display-error-message.component.scss'
})
export class DisplayErrorMessageComponent {
  @Input('errorMessage') errorMessage: string = '';
}
