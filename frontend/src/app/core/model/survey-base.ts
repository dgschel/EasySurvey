import { signal, computed } from "@angular/core"
import { SurveyBaseType, SurveyValidatorType, ValidatorConfig } from "../../util/type/survey-type"

export class SurveyBase<T extends SurveyBaseType> {
  title = signal<string>('');
  description = signal<string>('');
  validatorMap = signal<Partial<ValidatorConfig>>({} as Partial<ValidatorConfig>);

  state = computed<T>(() => ({
    title: this.title(),
    description: this.description(),
    validator: this.validatorMap()
  }) as T);

  setState(model: T) {
    this.title.set(model.title)
    this.description.set(model.description ?? '');
    this.updateValidator(model.validator);
  }

  updateValidator(validator: Partial<ValidatorConfig>) {
    this.validatorMap.update((prev) => ({ ...prev, ...validator }));
  }

  resetValidator() {
    this.validatorMap.set({})
  }

  deleteValidator(key: SurveyValidatorType) {
    const validator = this.validatorMap();
    delete validator[key];
    this.validatorMap.set({ ...validator });
  }
}