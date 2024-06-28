import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';

import { customRequiredValidator, customMinLengthValidator } from '../shared/form-validator/validators';
import { BasicCardComponent } from '../shared/ui/basic-card/basic-card.component';
import { FormControlInputComponent } from '../shared/feature/form-control-input/form-control-input.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, BasicCardComponent, FormControlInputComponent, JsonPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  form: FormGroup = new FormGroup({});
  fieldValidatorsFn: ValidatorFn[] = [customRequiredValidator(), customMinLengthValidator(3)];

  submit() {
    console.log(this.form);
  }
}