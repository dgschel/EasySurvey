import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export const customRequiredValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    // Use the built-in required validator
    const requiredValidator = Validators.required(control);
    return requiredValidator ? { required: 'message' } : null;
  }
}