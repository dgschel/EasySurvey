import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormControlErrorComponent } from '../../ui/form-control-error/form-control-error.component';
import { FormControlComponentValue, ValidatorConfig } from '../../../util/type/survey-type';
import { SurveyFormCheckboxControl } from '../../model/survey-form-control';

@Component({
  selector: 'app-form-control-checkbox',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, FormControlErrorComponent],
  templateUrl: './form-control-checkbox.component.html',
  styleUrl: './form-control-checkbox.component.scss',
  viewProviders: [{ // viewProviders is used to provide the parent form group to the child component. Useful for content projection
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, { skipSelf: true })
  }]
})
export class FormControlCheckboxComponent implements OnInit, FormControlComponentValue {
  parentContainer = inject(ControlContainer);
  controlKeyName = input<string>('');
  options = input<string[]>([]);
  label = input<string>();
  validator = input.required<Partial<ValidatorConfig>>({});
  surveyFormControl: SurveyFormCheckboxControl | undefined;

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get isFormControlValid() {
    return this.surveyFormControl?.isValid
  }

  get validationErrors() {
    return this.surveyFormControl?.validationErrors
  }

  get control() {
    return this.surveyFormControl?.control;
  }

  ngOnInit(): void {
    this.surveyFormControl = new SurveyFormCheckboxControl(this.parentFormGroup, this.validator(), this.options(), this.controlKeyName());
  }

  reset(): void {
    this.control?.reset([]);
  }

  getValue<T>(): T {
    return this.surveyFormControl?.selectedValues as T;
  }
}
