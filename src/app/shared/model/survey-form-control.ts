import { FormArray, ValidatorFn } from "@angular/forms";
import { BaseSurveyFormControl } from "../../core/model/base-form-control";
import { SurveyValidatorFn } from "../../util/type/survey-type";

export class SurveyFormControl extends BaseSurveyFormControl {
  constructor(form: FormArray, validator: SurveyValidatorFn, controlName: string = 'controlName') {
    const validatorFunctions = Object.values(validator);
    super(form, () => validatorFunctions, controlName);
  }
}