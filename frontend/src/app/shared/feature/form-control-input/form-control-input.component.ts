import { Component, OnInit, inject, input } from '@angular/core';
import { JsonPipe, NgClass } from '@angular/common';
import { ControlContainer, FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormControlErrorComponent } from '../../ui/form-control-error/form-control-error.component';
import { SurveyFormControl } from '../../model/survey-form-control';
import { ValidatorConfig } from '../../../util/type/survey-type';

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
  parentContainer = inject(ControlContainer);
  controlKeyName = input<string>('');
  placeholder = input<string>();
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

  get sections() {
    return this.parentFormGroup.get('sections') as FormArray;
  }

  get control() {
    return this.surveyFormControl?.control;
  }

  ngOnInit(): void {
    this.surveyFormControl = new SurveyFormControl(this.sections, this.validator(), this.controlKeyName());
  }

  ngOnDestroy(): void {
    if (this.surveyFormControl?.formGroup) {
      const formGroupIndex = this.sections.controls.indexOf(this.surveyFormControl.formGroup);
      if (formGroupIndex !== -1) {
        this.sections.removeAt(formGroupIndex);
      }
    }
  }
}
