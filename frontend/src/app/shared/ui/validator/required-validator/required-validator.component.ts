import { Component, Input } from '@angular/core';
import { ValidatorComponentInput, ValidatorValueChange } from '../../../../util/type/survey-type';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-required-validator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './required-validator.component.html',
  styleUrl: './required-validator.component.scss'
})
export class RequiredValidatorComponent implements ValidatorComponentInput<boolean> {
  // Callback function to send the value to the parent component
  // The parameter will indeed be used as it contains the object with the validatorType and value
  @Input() onValidatorValueChange = (value: ValidatorValueChange): void => { };
  @Input() value: boolean = false;

  valueChanged(value: boolean) {
    this.onValidatorValueChange({ validatorType: 'required', value });
  }
}
