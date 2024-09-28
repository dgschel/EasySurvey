import { Component, Input } from '@angular/core';
import { ValidatorComponentInput } from '../../../../util/type/survey-type';

@Component({
  selector: 'app-min-length-validator',
  standalone: true,
  imports: [],
  templateUrl: './min-length-validator.component.html',
  styleUrl: './min-length-validator.component.scss'
})
export class MinLengthValidatorComponent implements ValidatorComponentInput<number> {
  // Callback function to send the value to the parent component
  @Input() onValueChange = (value: number) => value;
}
