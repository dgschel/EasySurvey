import { FormArray, FormControl, FormGroup, ValidatorFn } from "@angular/forms";

/**
 * Represents a base form control for a survey.
 */
export class BaseSurveyFormControl {
  private fg = new FormGroup({});

  /**
   * Initializes a new instance of the BaseFormControl class.
   * @param formArray The parent form array.
   * @param validatorsFn A function that returns an array of validator functions.
   * @param controlName The name of the control.
   */
  constructor(public formArray: FormArray, public validatorsFn: () => ValidatorFn[], public controlName: string) {
    const control = new FormControl('', { validators: this.validatorsFn(), updateOn: 'blur' })
    this.fg.addControl(controlName, control);
    this.formArray.push(this.fg);
  }

  /**
   * Gets the control associated with the form control.
   * @returns The control associated with the form control.
   */
  get control() {
    return this.fg.get(this.controlName) as FormControl;
  }

  /**
    * Gets the parent form group associated with the form control.
    * @returns The parent form group associated with the form control.
    */
  get formGroup() {
    return this.fg;
  }

  /**
   * Gets a value indicating whether the control is valid.
   * @returns A value indicating whether the control is valid.
   */
  get isValid() {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  /**
   * Gets the validation errors associated with the control.
   * @returns The validation errors associated with the control.
   */
  get validationErrors() {
    const errors = this.control?.errors;
    return errors ? Object.values(errors) : null;
  }

  /**
   * Sets the validators for the form control.
   * 
   * @param validators - An array of validator functions.
   */
  set validators(validators: ValidatorFn[]) {
    this.control.setValidators(validators);
    this.control.updateValueAndValidity();
  }
}
