import { FormControlNameMap, FormControlType, SurveyModel } from "../../util/type/survey-type";
import { SurveyTemplateContract } from "../types/survey-template-contract";

export class SurveyTemplateManager {
  private surveys: Record<string, SurveyTemplateContract> = {};

  addSurvey(name: string, survey: SurveyTemplateContract) {
    this.surveys[name] = survey;
  }

  getSurvey(name: string): SurveyTemplateContract {
    return this.surveys[name];
  }

  getTemplateModelCounts(): Record<string, Record<string, number>> {
    return this.surveyTemplateModels.reduce((acc, { name, models }) => {
      const result = this.countModelTypes(models);
      const validators = this.getValidatorsFromModel(models);
      const uniqueValidators = Array.from(new Set(validators));

      const mappedResult = Object.keys(result).reduce((acc, key) => {
        const mappedKey = FormControlNameMap[key as FormControlType];
        return { ...acc, [mappedKey]: result[key] };
      }, {});

      return { ...acc, [name]: { ...mappedResult, validators: uniqueValidators } };
    }, {});
  }

  private countModelTypes(models: SurveyModel[]): Record<string, number> {
    const modelTypes = Array.from(new Set(models.map(model => model.type)));
    return modelTypes.reduce((acc, type) => {
      const modelCount = models.filter(model => model.type === type).length;
      return {
        ...acc,
        [type]: modelCount
      };
    }, {});
  }

  private getValidatorsFromModel(models: SurveyModel[]): string[] {
    return models.flatMap(model => Object.keys(model.validator));
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