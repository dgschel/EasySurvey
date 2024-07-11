import { FormArray, ValidatorFn } from "@angular/forms";
import { BaseSurveyFormControl } from "../../core/model/base-form-control";

export class SurveyFormControl extends BaseSurveyFormControl {
  constructor(form: FormArray, validatorsFn: ValidatorFn[] = [], controlName: string = 'controlName') {
    super(form, () => validatorsFn, controlName);
  }
}