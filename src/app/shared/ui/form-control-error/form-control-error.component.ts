import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-control-error',
  standalone: true,
  imports: [],
  template: `
    <div class="p-1 text-sm text-error font-semibold">{{ message() }}</div>
  `,
})
export class FormControlErrorComponent {
  message = input<string>('');
}
