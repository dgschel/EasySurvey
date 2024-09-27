// Only purpose is to serve as a token for angular dependency injection system
export abstract class AbstractValidator {
  abstract getValidators(): string[];
}

// Concrete class that implements the AbstractValidator
export class Validator extends AbstractValidator {
  constructor(private readonly validators: string[]) {
    super();
  }

  getValidators(): string[] {
    return this.validators;
  }
}