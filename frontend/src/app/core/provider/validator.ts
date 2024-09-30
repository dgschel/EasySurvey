import { Provider } from "@angular/core";

import { FormControlType } from "../../util/type/survey-type";
import { AbstractValidator, Validator } from "../model/validator";
import { formControlTypeValidatorMap } from "../../shared/form-validator/validators";

// The factory will return a new instance of the Validator class with the validators for the given control type
export function validatorFactory(controlType: FormControlType): Provider {
  const validators = formControlTypeValidatorMap[controlType];
  return {
    provide: AbstractValidator,
    useFactory: () => new Validator(validators)
  }
}

