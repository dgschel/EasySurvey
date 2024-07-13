import { AfterViewInit, Component, ComponentRef, ElementRef, inject, output, signal, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';

import { FormControlInputComponent } from '../form-control-input/form-control-input.component';
import { customRequiredValidator } from '../../form-validator/validators';
import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';
import { FormControlType } from '../../../util/type/survey-type';
import { createFormControlComponent } from '../../../util/component/create';

@Component({
  selector: 'app-survey-section',
  standalone: true,
  imports: [ReactiveFormsModule, NgComponentOutlet, BasicCardComponent, FormControlInputComponent],
  templateUrl: './survey-section.component.html',
  styleUrl: './survey-section.component.scss'
})
export class SurveySectionComponent implements AfterViewInit {
  formParentContainer = inject(ControlContainer);
  remove = output<void>();
  controlKeyName: string = 'name';
  formControlType: FormControlType = 'input'; // default form control type
  componentRef: ComponentRef<any> | undefined;

  @ViewChild('mySelect') mySelect!: ElementRef;
  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;

  get form() {
    return this.formParentContainer.control as FormGroup;
  }

  get sections() {
    return this.form.get('sections') as FormArray;
  }

  ngAfterViewInit(): void {
    this.createFormControlComponentInstance(this.formControlType);
  }

  setIsRequired(isRequired: boolean) {
    const validatorFn = isRequired ? [customRequiredValidator()] : []
    if (this.componentRef) {
      this.componentRef.instance.validators = validatorFn;
    }
  }

  createFormControlComponentInstance(controlType: FormControlType) {
    this.componentContainer.clear();
    const cmp = createFormControlComponent(controlType);
    this.componentRef = this.componentContainer.createComponent(cmp);
    this.componentRef.changeDetectorRef.detectChanges();
  }
}