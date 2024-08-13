import { AbstractControl, FormControl, FormGroup, ValidatorFn } from "@angular/forms";

/**
 * Represents a base form control for a survey.
 */
export class BaseSurveyFormControl {

  constructor(private form: FormGroup, public validatorsFn: () => ValidatorFn[], public controlName: string) {
    const control = new FormControl('', { validators: validatorsFn(), updateOn: 'blur' })
    form.addControl(controlName, control);
  }

  /**
   * Sets a new control that replace the current control
   * @param c - The new control
   */
  set control(c: AbstractControl) {
    this.form.setControl(this.controlName, c)
  }

  /**
   * Gets the control associated with the form control.
   * @returns The control associated with the form control.
   */
  get control() {
    return this.form.get(this.controlName) as AbstractControl;
  }

  /**
    * Gets the parent form group associated with the form control.
    * @returns The parent form group associated with the form control.
    */
  get formGroup() {
    return this.form;
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
