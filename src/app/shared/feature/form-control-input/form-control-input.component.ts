import { Component, OnInit, inject, input } from '@angular/core';
import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-form-control-input',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './form-control-input.component.html',
  styleUrl: './form-control-input.component.scss',
  viewProviders: [{ // viewProviders is used to provide the parent form group to the child component. Useful for content projection
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, { skipSelf: true })
  }]
})
export class FormControlInputComponent implements OnInit {
  inputControlName = input.required<string>();
  inputPlaceholder = input<string>();
  inputValidatorsFn = input<ValidatorFn[]>();
  parentContainer = inject(ControlContainer);

  private fb = inject(FormBuilder);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get control() {
    return this.parentFormGroup.get(this.inputControlName());
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(this.inputControlName(), this.fb.control<string>('', { validators: this.inputValidatorsFn() }));
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.inputControlName());
  }
}
