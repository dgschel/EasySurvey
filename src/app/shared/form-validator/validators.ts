import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export const customRequiredValidator = (message: string = "This field is required"): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    // Use the built-in required validator
    const validate = Validators.required(control);
    return validate ? { required: message } : null;
  }
}

export const customMinLengthValidator = (minLength: number = 2, message: string = `Min length of ${minLength} characters`): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    // Use the built-in minlength validator
    const validate = Validators.minLength(minLength)(control);
    return validate ? { required: message } : null;
  }
}
