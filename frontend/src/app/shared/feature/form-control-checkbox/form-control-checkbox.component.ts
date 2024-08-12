import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

import { FormControlErrorComponent } from '../../ui/form-control-error/form-control-error.component';
import { ValidatorConfig } from '../../../util/type/survey-type';
import { CheckboxArrayFormControl, SurveyCheckboxFormControl, SurveyFormControl } from '../../model/survey-form-control';
import { map } from 'rxjs';

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
export class FormControlCheckboxComponent {
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

  get sections() {
    return this.parentFormGroup.get('sections') as FormArray;
  }

  get control() {
    return this.surveyFormControl?.control;
  }

  get checkboxes(): FormArray<FormControl> {
    const lastSectionIndex = this.sections.length - 1;
    const lastSection = this.sections.at(lastSectionIndex) as FormGroup;
    console.log(this.surveyFormControl?.control.get(this.controlKeyName()) as FormArray)
    return lastSection.get(this.controlKeyName()) as FormArray;

    return this.surveyFormControl?.control.get(this.controlKeyName()) as FormArray;
  }

  onCheckboxChange(e: Event, index: number) {
    const checkboxes = this.checkboxes;
    const checkbox = checkboxes.at(index);
    const value = this.options()[index];
    const isChecked = (e.target as HTMLInputElement).checked;
    // checkbox.setValue(isChecked ? value : false);
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
    const controls = this.options().map(() => new FormControl(false));
    const array = new FormArray(controls, { validators: this.minSelectedCheckboxes(), updateOn: 'blur' });

    this.surveyFormControl = new CheckboxArrayFormControl(array, () => [], this.controlKeyName(), this.options());

    this.surveyFormControl.formGroup.addControl(this.controlKeyName(), array);
    console.log(this.surveyFormControl.control as any as FormArray)
  }

  get formControlArray() {
    return this.surveyFormControl?.control as any as FormArray<FormControl<boolean>>
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
