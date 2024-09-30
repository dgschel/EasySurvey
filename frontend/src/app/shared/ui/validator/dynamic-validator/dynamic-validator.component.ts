import { NgComponentOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SurveyValidatorType, ValidatorComponentType, ValidatorConfig, ValidatorValueChange } from '../../../../util/type/survey-type';
import { validatorComponentTypeMap } from '../../../form-validator/validators';

@Component({
  selector: 'app-dynamic-validator',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './dynamic-validator.component.html',
  styleUrl: './dynamic-validator.component.scss'
})
export class DynamicValidatorComponent {
  @Input() validators: SurveyValidatorType[] = [];
  @Input() validatorState: Partial<ValidatorConfig> = {};
  @Output() validatorValueChange = new EventEmitter<ValidatorValueChange>();

  // Callback function pass down to the child component using the @Input() decorator
  onValidatorValueChange = (change: ValidatorValueChange) => {
    this.validatorValueChange.emit({ validatorType: change.validatorType, value: change.value });
  }

  // Get the input object for the validator component
  getInputs(validator: SurveyValidatorType): Record<string, unknown> {
    // Interface ValidatorComponentInput<T>
    // We are returning an object to satisfy the interface of ngComponentOutlet
    return {
      onValidatorValueChange: this.onValidatorValueChange,
      value: this.validatorState[validator]?.value
    }
  }

  getValidatorComponent(validator: SurveyValidatorType): ValidatorComponentType {
    return validatorComponentTypeMap[validator];
  }
}
