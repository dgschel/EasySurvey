import { signal, computed } from "@angular/core"

export class SurveyBase {
  title = signal<string>('')
  description = signal<string>('') // Modify the type to allow undefined
  hasDescription = signal<boolean>(false)

  state = computed(() => ({
    title: this.title(),
    description: this.description()
  }))
}
