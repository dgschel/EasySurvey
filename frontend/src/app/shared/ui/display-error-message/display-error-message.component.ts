import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display-error-message',
  standalone: true,
  imports: [],
  templateUrl: './display-error-message.component.html',
  styleUrl: './display-error-message.component.scss'
})
export class DisplayErrorMessageComponent {
  @Input('errorMessage') errorMessage: string = '';
}
