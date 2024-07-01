import { Component, OnInit, inject, input } from '@angular/core';
import { JsonPipe, NgClass } from '@angular/common';
import { ControlContainer, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

import { FormControlErrorComponent } from '../../ui/form-control-error/form-control-error.component';
import { SurveyFormControl } from '../../model/survey-form-control';

@Component({
  selector: 'app-form-control-input',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgClass, FormControlErrorComponent],
  templateUrl: './form-control-input.component.html',
  styleUrl: './form-control-input.component.scss',
  viewProviders: [{ // viewProviders is used to provide the parent form group to the child component. Useful for content projection
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, { skipSelf: true })
  }]
})
export class FormControlInputComponent implements OnInit {
  controlKeyName = input.required<string>();
  inputPlaceholder = input<string>();
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
