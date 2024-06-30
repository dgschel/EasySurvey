import { Component, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-form-control-select',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './form-control-select.component.html',
  styleUrl: './form-control-select.component.scss',
  viewProviders: [{ // viewProviders is used to provide the parent form group to the child component. Useful for content projection
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, { skipSelf: true })
  }]
})
export class FormControlSelectComponent {
  formControlKey = input.required<string>();
  validatorsFn = input<ValidatorFn[]>();
  parentContainer = inject(ControlContainer);

  private fb = inject(FormBuilder);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get control() {
    return this.parentFormGroup.get(this.formControlKey());
  }

  get isInvalidAndTouchedOrDirty() {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(this.formControlKey(), this.fb.control('', { validators: this.validatorsFn(), updateOn: 'blur' }));
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.formControlKey());
  }
}
