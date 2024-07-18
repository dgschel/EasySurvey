import { signal, computed } from "@angular/core"
import { SurveyBaseType } from "../../util/type/survey-type"

export class SurveyBase {
  title = signal<string>('')
  description = signal<string>('')

  state = computed<SurveyBaseType>(() => ({
    title: this.title(),
    description: this.description(),
    validators: []
  }))
}
