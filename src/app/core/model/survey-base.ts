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

  setState(state: T): void {
    this.setValidatorMap(state.validator);
    this.setTitle(state.title);
    this.setDescription(state.description);
  }

  setType(type: FormControlType): void {
    this.type.set(type);
  }

  setTitle(title: string): void {
    this.title.set(title);
  }

  setDescription(description: string): void {
    this.description.set(description);
  }

  setValidatorMap(validatorMap: Partial<SurveyValidatorMap>): void {
    this.validatorMap.set(validatorMap as SurveyValidatorMap);
  }
}