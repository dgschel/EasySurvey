import { Component, ElementRef, inject, OnInit, output, signal, ViewChild } from '@angular/core';
import { ControlContainer, FormGroup, FormArray, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';

import { FormControlInputComponent } from '../form-control-input/form-control-input.component';
import { customRequiredValidator } from '../../form-validator/validators';
import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';
import { FormControlType, SupportedComponents } from '../../../util/type/survey-type';
import { createFormControlComponent } from '../../../util/component/create';

@Component({
  selector: 'app-survey-section',
  standalone: true,
  imports: [ReactiveFormsModule, NgComponentOutlet, BasicCardComponent, FormControlInputComponent],
  templateUrl: './survey-section.component.html',
  styleUrl: './survey-section.component.scss'
})
export class SurveySectionComponent implements OnInit {
  formParentContainer = inject(ControlContainer);
  remove = output<void>();
  controlKeyName: string = 'name';
  isRequired = signal<boolean>(false);
  fnValidators: ValidatorFn[] = [customRequiredValidator()];

  cmpType: FormControlType = 'input';
  component: SupportedComponents = FormControlInputComponent;

  @ViewChild('mySelect') mySelect!: ElementRef;

  get form() {
    return this.formParentContainer.control as FormGroup;
  }

  get sections() {
    return this.form.get('sections') as FormArray;
  }

  ngOnInit() {
    this.component = createFormControlComponent(this.cmpType);
  }

  trackChange(controlType: string) {
    this.component = createFormControlComponent(controlType as FormControlType);
  }
}