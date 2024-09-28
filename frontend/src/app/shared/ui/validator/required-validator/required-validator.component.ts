import { Component, Input } from '@angular/core';
import { ValidatorComponentInput } from '../../../../util/type/survey-type';

@Component({
  selector: 'app-required-validator',
  standalone: true,
  imports: [],
  templateUrl: './required-validator.component.html',
  styleUrl: './required-validator.component.scss'
})
export class RequiredValidatorComponent implements ValidatorComponentInput<boolean> {
  @Input() onValueChange = (value: boolean) => value;
}
