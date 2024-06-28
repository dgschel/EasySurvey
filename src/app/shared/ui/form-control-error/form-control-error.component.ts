import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-control-error',
  standalone: true,
  imports: [],
  template: `
    <div class="mx-1 my-2 text-sm text-error font-semibold">{{ message() }}</div>
  `,
})
export class FormControlErrorComponent {
  message = input<string>('');
}
