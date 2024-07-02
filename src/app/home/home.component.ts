import { AfterViewInit, ChangeDetectorRef, Component, InputSignal, TemplateRef, Type, ViewChild, ViewContainerRef, input, signal } from '@angular/core';
import { CommonModule, JsonPipe, NgForOf, NgTemplateOutlet } from '@angular/common';
import { FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

import { customRequiredValidator, customMinLengthValidator } from '../shared/form-validator/validators';
import { BasicCardComponent } from '../shared/ui/basic-card/basic-card.component';
import { FormControlInputComponent } from '../shared/feature/form-control-input/form-control-input.component';
import { FormControlSelectComponent } from '../shared/feature/form-control-select/form-control-select.component';
import { ComponentType, FormSurveyComponent, mappedComponents } from '../util/type/survey-type';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, FormControlSelectComponent, NgForOf, NgTemplateOutlet, CommonModule, BasicCardComponent, FormControlInputComponent, JsonPipe, NgTemplateOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  form: FormGroup = new FormGroup({});
  fieldValidatorsFn: ValidatorFn[] = [customRequiredValidator(), customMinLengthValidator(3)];
  validatorRequiredFn: ValidatorFn[] = [customRequiredValidator()];

  components: ComponentType<FormControlInputComponent | FormControlSelectComponent>[] = [
    {
      component: FormControlInputComponent,
      inputs: {
        controlKeyName: 'customInput',
        inputPlaceholder: 'Input placeholder',
        validatorsFn: this.fieldValidatorsFn
      }
    },
    {
      component: FormControlSelectComponent,
      inputs: {
        controlKeyName: 'customSelect',
        validatorsFn: this.validatorRequiredFn
      }
    }
  ];

  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('component') template!: TemplateRef<any>;
  options = [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  submit() {
    console.log(this.form);
  }

  add(component: FormSurveyComponent) {
    const componentToCreate = mappedComponents[component];

    console.log({
      component,
      componentToCreate
    })
    this.components.push({
      component: componentToCreate,
      inputs: {
        controlKeyName: Date.now().toString(),
      }
    })
  }
}