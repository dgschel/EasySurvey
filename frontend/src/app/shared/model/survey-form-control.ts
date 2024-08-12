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
export class SurveyCheckboxFormControl {
  constructor(form: FormArray, validator: Partial<ValidatorConfig>, controlName: string = 'controlName') {
    const validators = createValidators(validator);
    // super(form, () => validators, controlName);
  }
}

export class CheckboxArrayFormControl extends BaseSurveyFormControl {
  /**
   * Initializes a new instance of the CheckboxArrayFormControl class.
   * @param formArray The parent form array.
   * @param validatorsFn A function that returns an array of validator functions.
   * @param controlName The name of the control.
   * @param checkboxOptions The options for the checkboxes.
   */
  constructor(
    formArray: FormArray,
    validatorsFn: () => ValidatorFn[],
    controlName: string,
    private checkboxOptions: string[]
  ) {
    super(formArray, validatorsFn, controlName);
    this.initializeCheckboxes();
  }

  /**
   * Initializes the checkboxes.
   */
  private initializeCheckboxes() {
    this.checkboxOptions.forEach(option => {
      const checkboxControl = new FormControl(false);
      // (this.control as FormArray).push(checkboxControl);
    });
  }

  /**
   * Gets the values of the selected checkboxes.
   * @returns The values of the selected checkboxes.
   */
  get selectedValues() {
    return this.checkboxOptions.filter((_, index) => this.isChecked(index));
  }

  /**
   * Checks if the checkbox at the specified index is checked.
   * @param index The index of the checkbox.
   * @returns True if the checkbox is checked, false otherwise.
   */
  isChecked(index: number) {
    const checkboxControl = (this.control as unknown as FormArray).controls[index];
    return checkboxControl.value;
  }
}