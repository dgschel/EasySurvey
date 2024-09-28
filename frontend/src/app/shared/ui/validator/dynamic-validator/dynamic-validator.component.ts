import { NgComponentOutlet } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SurveyValidatorType, ValidatorComponentType, ValidatorValueChange } from '../../../../util/type/survey-type';
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
  @Output() validatorValueChange = new EventEmitter<ValidatorValueChange>();

  // Callback function pass down to the child component using the @Input() decorator
  onValidatorValueChange = (change: ValidatorValueChange) => {
    this.validatorValueChange.emit({ validatorType: change.validatorType, value: change.value });
  }

  getValidatorComponent(validator: SurveyValidatorType): ValidatorComponentType {
    return validatorComponentTypeMap[validator];
  }
}
