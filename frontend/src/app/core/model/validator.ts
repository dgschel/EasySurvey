import { SurveyValidatorType } from "../../util/type/survey-type";

// Only purpose is to serve as a token for angular dependency injection system
export abstract class AbstractValidator {
  abstract getValidators(): SurveyValidatorType[];
}

// Concrete class that implements the AbstractValidator
export class Validator extends AbstractValidator {
  constructor(private readonly validators: SurveyValidatorType[]) {
    super();
  }

  getValidators(): SurveyValidatorType[] {
    return this.validators;
  }
}