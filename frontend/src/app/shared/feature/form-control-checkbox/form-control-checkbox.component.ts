import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormControlErrorComponent } from '../../ui/form-control-error/form-control-error.component';
import { ValidatorConfig } from '../../../util/type/survey-type';
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
export class FormControlCheckboxComponent implements OnInit {
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

  // TODO: Add this to our validator config either as a new function or if required is set, then use this validator for checkboxes
  minSelectedCheckboxes(min = 2) {
    const validator: any = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);

      return totalSelected >= min ? null : { message: `At least ${min} to select` };
    };

    return validator;
  }

  ngOnInit(): void {
    this.surveyFormControl = new SurveyFormCheckboxControl(this.parentFormGroup, () => [], this.options(), this.controlKeyName());
    this.surveyFormControl.validators = [this.minSelectedCheckboxes(2)];
  }
}
