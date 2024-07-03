import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { CommonModule, JsonPipe, NgComponentOutlet, NgForOf, NgTemplateOutlet } from '@angular/common';
import { FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

import { customRequiredValidator, customMinLengthValidator } from '../shared/form-validator/validators';
import { BasicCardComponent } from '../shared/ui/basic-card/basic-card.component';
import { FormControlInputComponent } from '../shared/feature/form-control-input/form-control-input.component';
import { FormControlSelectComponent } from '../shared/feature/form-control-select/form-control-select.component';
import { DynamicComponentType, FormControlType, formControlComponentMap } from '../util/type/survey-type';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, FormControlSelectComponent, NgComponentOutlet, BasicCardComponent, FormControlInputComponent, JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  form: FormGroup = new FormGroup({});
  fieldValidatorsFn: ValidatorFn[] = [customRequiredValidator(), customMinLengthValidator(3)];
  validatorRequiredFn: ValidatorFn[] = [customRequiredValidator()];
  options = signal(['Option 1', 'Option 2', 'Option 3']);

  components: DynamicComponentType<FormControlInputComponent | FormControlSelectComponent>[] = [
    {
      component: FormControlInputComponent,
      inputs: {
        controlKeyName: 'customInput',
        inputPlaceholder: 'Input placeholder',
        validatorsFn: this.fieldValidatorsFn,
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

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  submit() {
    console.log(this.form);
  }

  addFormControl(controlType: FormControlType) {
    const component = formControlComponentMap[controlType];

    this.components.push({
      component,
      inputs: {
        controlKeyName: Date.now().toString(),
        validatorsFn: this.validatorRequiredFn,
        label: 'New control'
      }
    })
  }
}