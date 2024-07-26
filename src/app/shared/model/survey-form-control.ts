import { FormArray } from "@angular/forms";
import { BaseSurveyFormControl } from "../../core/model/base-form-control";
import { SurveyValidatorType, ValidatorConfig } from "../../util/type/survey-type";
import { surveyValidatorMap } from "../form-validator/validators";

export class SurveyFormControl extends BaseSurveyFormControl {
  constructor(form: FormArray, validator: ValidatorConfig, controlName: string = 'controlName') {
    const validators = Object.keys(validator).map((key => surveyValidatorMap[key as SurveyValidatorType](validator)));
    super(form, () => validators, controlName);
  }
}