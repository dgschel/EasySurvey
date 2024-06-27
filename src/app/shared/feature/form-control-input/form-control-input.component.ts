import { Component, inject, input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-form-control-input',
  standalone: true,
  imports: [],
  templateUrl: './form-control-input.component.html',
  styleUrl: './form-control-input.component.scss'
})
export class FormControlInputComponent {
  inputControlName = input.required<string>();
  inputPlaceholder = input<string>();

  private nnfb = inject(FormBuilder);
}
