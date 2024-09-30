import { Component, Input } from '@angular/core';
import { ValidatorComponentInput, ValidatorValueChange } from '../../../../util/type/survey-type';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-min-selected-validator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './min-selected-validator.component.html',
  styleUrl: './min-selected-validator.component.scss'
})
export class MinSelectedValidatorComponent implements ValidatorComponentInput<number> {
  // Callback function to send the value to the parent component
  // The parameter will indeed be used as it contains the object with the validatorType and value
  @Input() onValidatorValueChange = (value: ValidatorValueChange): void => { };
  @Input() value: number = 0;

  valueChanged(value: number) {
    this.onValidatorValueChange({ validatorType: 'minSelected', value });
  }
}
