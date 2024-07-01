import { FormGroup, ValidatorFn } from "@angular/forms";
import { BaseFormControl } from "../../core/model/base-form-control";

export class FormSelectControl extends BaseFormControl {
  constructor(form: FormGroup, validatorsFn: ValidatorFn[] = [], controlName: string = 'customSelect') {
    super(form, () => validatorsFn, controlName);
  }
}