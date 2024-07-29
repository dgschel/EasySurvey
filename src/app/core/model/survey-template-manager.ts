import { SurveyTemplateContract } from "../types/survey-template-contract";

export class SurveyTemplateManager {
  private surveys: Record<string, SurveyTemplateContract> = {};

  addSurvey(name: string, survey: SurveyTemplateContract) {
    this.surveys[name] = survey;
  }

  getSurvey(name: string): SurveyTemplateContract {
    return this.surveys[name];
  }

  get surveyNames(): string[] {
    return Object.keys(this.surveys);
  }

  get surveyModels() {
    return this.surveyNames.map(name => {
      return { name, models: this.getSurvey(name).createPredefinedSurvey() };
    })
  }
}