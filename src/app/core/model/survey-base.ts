import { signal, computed } from "@angular/core"
import { SurveyBaseType, ValidatorConfig } from "../../util/type/survey-type"

export class SurveyBase<T extends SurveyBaseType> {
  title = signal<string>('');
  description = signal<string>('');
  validatorMap = signal<Partial<ValidatorConfig>>({} as Partial<ValidatorConfig>);

  state = computed<T>(() => ({
    title: this.title(),
    description: this.description(),
    validator: this.validatorMap()
  }) as T);
}