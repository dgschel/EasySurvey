import { Component, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ControlContainer, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

import { FormControlErrorComponent } from '../../ui/form-control-error/form-control-error.component';
import { SurveyFormControl } from '../../class/form-select-control';

@Component({
  selector: 'app-form-control-select',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, FormControlErrorComponent],
  templateUrl: './form-control-select.component.html',
  styleUrl: './form-control-select.component.scss',
  viewProviders: [{ // viewProviders is used to provide the parent form group to the child component. Useful for content projection
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, { skipSelf: true })
  }]
})
export class FormControlSelectComponent {
  controlKeyName = input.required<string>();
  validatorsFn = input<ValidatorFn[]>();
  parentContainer = inject(ControlContainer);

  surveyFormControl: SurveyFormControl | null = null;

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get isFormControlValid() {
    return this.surveyFormControl?.isValid
  }

  get validationErrors() {
    return this.surveyFormControl?.validationErrors
  }

  ngOnInit(): void {
    this.surveyFormControl = new SurveyFormControl(this.parentFormGroup, this.validatorsFn(), this.controlKeyName());
  }

  ngOnDestroy(): void {
    this.parentFormGroup.removeControl(this.controlKeyName());
  }
}
