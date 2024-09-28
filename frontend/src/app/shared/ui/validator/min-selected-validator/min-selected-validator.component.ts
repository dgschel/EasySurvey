import { Component, Input } from '@angular/core';
import { ValidatorComponentInput } from '../../../../util/type/survey-type';

@Component({
  selector: 'app-min-selected-validator',
  standalone: true,
  imports: [],
  templateUrl: './min-selected-validator.component.html',
  styleUrl: './min-selected-validator.component.scss'
})
export class MinSelectedValidatorComponent implements ValidatorComponentInput<number> {
  // Callback function to send the value to the parent component
  @Input() onValueChange = (value: number) => value;
}
