import { signal, computed } from "@angular/core"
import { SurveyBaseType, SurveyValidatorMap } from "../../util/type/survey-type"

export class SurveyBase {
  title = signal<string>('')
  description = signal<string>('')
  validatorMap = signal<SurveyValidatorMap>({} as SurveyValidatorMap);

  state = computed<SurveyBaseType>(() => ({
    title: this.title(),
    description: this.description(),
    validator: this.validatorMap()
  }))
}
