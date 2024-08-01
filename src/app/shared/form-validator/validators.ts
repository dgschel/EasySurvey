import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { SurveyValidatorMap, SurveyValidatorType, ValidatorConfig } from "../../util/type/survey-type";

export const customRequiredValidator = (message: string = "This field is required"): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    // Use the built-in required validator
    const validate = Validators.required(control);
    return validate ? { message } : null;
  }
}

export const customMinLengthValidator = (minLength: number = 3, message: string = `Min length of ${minLength} characters`): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    // Use the built-in minlength validator
    const validate = Validators.minLength(minLength)(control);
    return validate ? { message } : null;
  }
}

export const surveyValidatorMap: SurveyValidatorMap<Partial<ValidatorConfig>> = {
  required: (config: Partial<ValidatorConfig>) => customRequiredValidator(config.required?.message),
  minLength: (config: Partial<ValidatorConfig>) => customMinLengthValidator(config.minLength?.value, config.minLength?.message)
}

export const createValidators = (config: Partial<ValidatorConfig>): ValidatorFn[] => {
  return Object.keys(config)
    .filter(key => config[key as SurveyValidatorType])
    .map(key => surveyValidatorMap[key as SurveyValidatorType](config));
}
