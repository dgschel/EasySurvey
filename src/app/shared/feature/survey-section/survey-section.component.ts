import { Component, ComponentRef, inject, output, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';

import { FormControlInputComponent } from '../form-control-input/form-control-input.component';
import { customRequiredValidator } from '../../form-validator/validators';
import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';
import { FormControlComponentType } from '../../../util/type/survey-type';
import { CreateComponentComponent } from "../../ui/create-component/create-component.component";

@Component({
  selector: 'app-survey-section',
  standalone: true,
  imports: [ReactiveFormsModule, NgComponentOutlet, BasicCardComponent, FormControlInputComponent, CreateComponentComponent],
  templateUrl: './survey-section.component.html',
  styleUrl: './survey-section.component.scss'
})
export class SurveySectionComponent {
  formParentContainer = inject(ControlContainer);
  remove = output<void>();
  controlKeyName: string = 'name';
  componentRef: ComponentRef<any> | undefined;

  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;

  get form() {
    return this.formParentContainer.control as FormGroup;
  }

  get sections() {
    return this.form.get('sections') as FormArray;
  }

  setIsRequired(isRequired: boolean) {
    const validatorFn = isRequired ? [customRequiredValidator()] : []
    if (this.componentRef) {
      this.componentRef.instance.validators = validatorFn;
    }
  }

  onCreateComponent(componentType: Type<FormControlComponentType>) {
    this.componentContainer.clear();
    this.componentRef = this.componentContainer.createComponent(componentType);
    this.componentRef.changeDetectorRef.detectChanges();
  }
}