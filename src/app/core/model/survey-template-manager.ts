import { SurveyTemplateContract } from "../types/survey-template-contract";

export class SurveyTemplateManager {
  private surveys: Record<string, SurveyTemplateContract> = {};

  addSurvey(name: string, survey: SurveyTemplateContract) {
    this.surveys[name] = survey;
  }

  getSurvey(name: string): SurveyTemplateContract {
    return this.surveys[name];
  }

  get countTotalTemplateControls() {
    return Object.values(this.countControlsBySurvey).reduce((acc, curr) => acc + curr, 0);
  }

  get countControlsBySurvey(): Record<string, number> {
    return this.surveyNames.reduce((acc, name) => {
      return {
        ...acc,
        [name]: this.getSurvey(name).createPredefinedSurvey().length
      }
    }, {});
  }

  get surveyNames(): string[] {
    return Object.keys(this.surveys);
  }

  get surveyTemplateModels() {
    return this.surveyNames.map(name => {
      return { name, models: this.getSurvey(name).createPredefinedSurvey() };
    })
  }

}