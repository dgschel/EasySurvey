import { FormArray } from "@angular/forms";
import { BaseSurveyFormControl } from "../../core/model/base-form-control";
import { ValidatorConfig } from "../../util/type/survey-type";
import { createValidators } from "../form-validator/validators";

export class SurveyFormControl extends BaseSurveyFormControl {
  constructor(form: FormArray, validator: Partial<ValidatorConfig>, controlName: string = 'controlName') {
    const validators = createValidators(validator);
    super(form, () => validators, controlName);
  }
}