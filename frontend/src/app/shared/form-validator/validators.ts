import { AbstractControl, FormArray, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { FormControlTypeValidatorMap, SurveyValidatorMap, SurveyValidatorType, ValidatorConfig } from "../../util/type/survey-type";

export const customRequiredValidator = (message: string = "This field is required"): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    // Use the built-in required validator
    const validate = Validators.required(control);
    return validate ? { message } : null;
  }
}

export const customMinLengthValidator = (minLength: number = 3): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    // Use the built-in minlength validator
    const validate = Validators.minLength(minLength)(control);
    return validate ? { message: `Antwort muss mindestens ${minLength} Zeichen lang sein` } : null;
  }
}

/**
 * Validates the selection of checkboxes in a custom select component
 * 
 * @param min The minimum number of checkboxes that must be selected
 * @returns A validator function that returns a ValidationErrors object if the selection is invalid, or null if it is valid
 */
export const customSelectCheckboxesValidator = (min: number = 1): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const totalSelected = (control as FormArray).controls
      .map(control => control.value)
      .reduce((prev, next) => next ? prev + next : prev, 0);

    return totalSelected >= min ? null : { message: `Mindestens ${min} Kästchen müssen ausgewählt werden` };
  }
}

export const surveyValidatorMap: SurveyValidatorMap<Partial<ValidatorConfig>> = {
  required: (config: Partial<ValidatorConfig>) => customRequiredValidator(config.required?.message),
  minLength: (config: Partial<ValidatorConfig>) => customMinLengthValidator(config.minLength?.value),
  minSelected: (config: Partial<ValidatorConfig>) => customSelectCheckboxesValidator(config.minSelected?.value)
}

export const createValidators = (config: Partial<ValidatorConfig>): ValidatorFn[] => {
  return Object.keys(config)
    .filter(key => config[key as SurveyValidatorType])
    .map(key => surveyValidatorMap[key as SurveyValidatorType](config));
}

export const formControlTypeValidatorMap: FormControlTypeValidatorMap = {
  input: ['required', 'minLength'],
  select: ['required'],
  radio: ['required'],
  checkbox: ['minSelected']
}