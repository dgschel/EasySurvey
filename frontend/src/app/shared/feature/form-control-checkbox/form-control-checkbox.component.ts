import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormControlErrorComponent } from '../../ui/form-control-error/form-control-error.component';
import { ValidatorConfig } from '../../../util/type/survey-type';
import { SurveyCheckboxFormControl, SurveyFormControl } from '../../model/survey-form-control';
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

  get getCheckboxes(): FormArray<FormControl> {
    const lastSectionIndex = this.sections.length - 1;
    const lastSection = this.sections.at(lastSectionIndex) as FormGroup;
    return lastSection.get(this.controlKeyName()) as FormArray;
  }

  onCheckboxChange(e: Event, index: number) {
    const checkboxes = this.getCheckboxes;
    const checkbox = checkboxes.at(index);
    const value = this.options()[index];
    const isChecked = (e.target as HTMLInputElement).checked;
    checkbox.setValue(isChecked ? value : false);
  }

  ngOnInit(): void {
    const controls = this.options().map(() => new FormControl(false));
    const array = new FormArray(controls);
    const fg = new FormGroup({ [this.controlKeyName()]: array })

    this.sections.push(fg);

    // this.surveyFormControl = new SurveyFormControl(array, this.validator(), this.controlKeyName()); 
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
