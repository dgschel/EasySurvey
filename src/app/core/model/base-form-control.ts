import { FormControl, FormGroup, ValidatorFn } from "@angular/forms";

/**
 * Represents a base form control
 */
interface BaseFormControl {
  formGroup: FormGroup;
  validatorsFn: () => ValidatorFn[];
}

/**
 * Represents a base form control.
 */
export class BaseSurveyFormControl implements BaseFormControl {
  /**
   * Initializes a new instance of the BaseFormControl class.
   * @param formGroup The parent form group.
   * @param validatorsFn A function that returns an array of validator functions.
   * @param controlName The name of the control.
   */
  constructor(public formGroup: FormGroup, public validatorsFn: () => ValidatorFn[], public controlName: string) {
    this.formGroup.addControl(this.controlName, new FormControl('', { validators: this.validatorsFn(), updateOn: 'blur' }));
  }

  /**
   * Gets the control associated with the form control.
   */
  get control() {
    return this.formGroup.get(this.controlName);
  }

  /**
   * Gets a value indicating whether the control is valid.
   */
  get isValid() {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  /**
   * Gets the validation errors associated with the control.
   */
  get validationErrors() {
    const errors = this.control?.errors;
    return errors ? Object.values(errors) : null;
  }
}
