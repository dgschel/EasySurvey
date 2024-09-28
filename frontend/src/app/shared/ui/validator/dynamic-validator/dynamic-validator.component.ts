import { NgComponentOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';

import { SurveyValidatorType, ValidatorComponentType } from '../../../../util/type/survey-type';
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

  getValidatorComponent(validator: SurveyValidatorType): ValidatorComponentType {
    return validatorComponentTypeMap[validator];
  }
}
