import { Component, Input } from '@angular/core';
import { ValidatorComponentInput, ValidatorValueChange } from '../../../../util/type/survey-type';

@Component({
  selector: 'app-min-length-validator',
  standalone: true,
  imports: [],
  templateUrl: './min-length-validator.component.html',
  styleUrl: './min-length-validator.component.scss'
})
export class MinLengthValidatorComponent implements ValidatorComponentInput<number> {
  // Callback function to send the value to the parent component
  // The parameter will indeed be used as it contains the object with the validatorType and value
  @Input() onValidatorValueChange = (value: ValidatorValueChange): void => { };

  valueChanged(value: number) {
    this.onValidatorValueChange({ validatorType: 'minLength', value });
  }
}
