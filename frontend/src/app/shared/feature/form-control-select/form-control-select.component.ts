import { Component, inject, input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormControlErrorComponent } from '../../ui/form-control-error/form-control-error.component';
import { SurveyFormControl } from '../../model/survey-form-control';
import { FormControlComponentValue, ValidatorConfig } from '../../../util/type/survey-type';

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
export class FormControlSelectComponent implements OnInit, FormControlComponentValue {
  parentContainer = inject(ControlContainer);
  controlKeyName = input<string>('');
  options = input<string[]>([]);
  label = input<string>();
  validator = input.required<Partial<ValidatorConfig>>({});
  surveyFormControl: SurveyFormControl | undefined;

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
    this.surveyFormControl = new SurveyFormControl(this.parentFormGroup, this.validator(), this.controlKeyName());
  }

  getValue<T>(): T {
    return this.control?.value as T
  }
}
