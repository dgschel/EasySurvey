import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormArray, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';

import { FormControlInputComponent } from '../form-control-input/form-control-input.component';
import { FormControlSelectComponent } from '../form-control-select/form-control-select.component';
import { customRequiredValidator } from '../../form-validator/validators';
import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';

@Component({
  selector: 'app-survey-section',
  standalone: true,
  imports: [ReactiveFormsModule, NgComponentOutlet, BasicCardComponent, FormControlInputComponent],
  templateUrl: './survey-section.component.html',
  styleUrl: './survey-section.component.scss'
})
export class SurveySectionComponent {
  formParentContainer = inject(ControlContainer);
  fb = inject(FormBuilder);
  controlKeyName: string = 'name';
  validatorRequiredFn: ValidatorFn[] = [customRequiredValidator()];

  inputs = {
    controlKeyName: this.controlKeyName,
    validatorsFn: this.validatorRequiredFn
  }

  component: typeof FormControlInputComponent | typeof FormControlSelectComponent = FormControlInputComponent;

  @ViewChild('mySelect') mySelect!: ElementRef;

  get form() {
    return this.formParentContainer.control as FormGroup;
  }

  get sections() {
    return this.form.get('sections') as FormArray;
  }

  trackChange() {
    this.component = this.mySelect.nativeElement.value === '1' ? FormControlInputComponent : FormControlSelectComponent
    console.log("trackChange", this.mySelect.nativeElement.value);
  }
}
