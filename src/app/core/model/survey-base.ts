import { signal, computed } from "@angular/core"
import { FormControlType, SurveyBaseType, SurveyValidatorMap } from "../../util/type/survey-type"

export class SurveyBase<T extends SurveyBaseType> {
  type = signal<FormControlType>('input');
  title = signal<string>('');
  description = signal<string>('');
  validatorMap = signal<SurveyValidatorMap>({} as SurveyValidatorMap);

  state = computed<T>(() => ({
    title: this.title(),
    description: this.description(),
    validator: this.validatorMap()
  }) as T);
}