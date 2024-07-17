import { signal, computed } from "@angular/core"
import { SurveyBaseType } from "../../util/type/survey-type"

export class SurveyBase {
  title = signal<string>('')
  description = signal<string>('')
  hasDescription = signal<boolean>(false)

  state = computed<SurveyBaseType>(() => ({
    title: this.title(),
    description: this.description()
  }))
}
