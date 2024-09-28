import { Component, Input } from '@angular/core';
import { ValidatorValueChange } from '../../../../util/type/survey-type';

@Component({
  selector: 'app-min-selected-validator',
  standalone: true,
  imports: [],
  templateUrl: './min-selected-validator.component.html',
  styleUrl: './min-selected-validator.component.scss'
})
export class MinSelectedValidatorComponent {
  // Callback function to send the value to the parent component
  // The parameter will indeed be used as it contains the object with the validatorType and value
  @Input() onValidatorValueChange = (value: ValidatorValueChange): void => { };

  valueChanged(value: number) {
    this.onValidatorValueChange({ validatorType: 'minSelected', value });
  }
}
