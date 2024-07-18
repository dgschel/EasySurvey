import { FormArray } from "@angular/forms";
import { BaseSurveyFormControl } from "../../core/model/base-form-control";
import { SurveyValidatorMap } from "../../util/type/survey-type";

export class SurveyFormControl extends BaseSurveyFormControl {
  constructor(form: FormArray, validator: SurveyValidatorMap, controlName: string = 'controlName') {
    const validatorsFn = Object.values(validator)
    super(form, () => validatorsFn, controlName);
  }
}