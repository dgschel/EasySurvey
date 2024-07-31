import { FormControlNameMap, FormControlType, SurveyFormControlCount, SurveyModel, SurveyTemplateModel } from "../../util/type/survey-type";
import { SurveyTemplateContract } from "../types/survey-template-contract";

export class SurveyTemplateManager {
  private surveys: Record<string, SurveyTemplateContract> = {};

  addSurvey(name: string, survey: SurveyTemplateContract) {
    this.surveys[name] = survey;
  }

  getSurvey(name: string): SurveyTemplateContract {
    return this.surveys[name];
  }

  getTemplateModelTypeCounts(): Record<string, SurveyFormControlCount> {
    return this.surveyTemplateModels.reduce((acc, { name, models }) => {
      const result = this.countModelTypes(models);
      const mappedResult = Object.keys(result).reduce((acc, key) => {
        const mappedKey = FormControlNameMap[key as FormControlType];
        return { ...acc, [mappedKey]: result[key] };
      }, {});

      return { ...acc, [name]: { ...mappedResult } };
    }, {});
  }

  getUniqueModelValidators(models: SurveyModel[]): string[] {
    return Array.from(new Set(this.getValidatorsFromModels(models)));
  }

  getValidatorsFromSurvey(surveyName: string): string[] {
    return this.getUniqueModelValidators(this.getSurvey(surveyName).createPredefinedSurvey());
  }

  countModelTypes(models: SurveyModel[]): SurveyFormControlCount {
    const modelTypes = Array.from(new Set(models.map(model => model.type)));
    return modelTypes.reduce((acc, type) => {
      const modelCount = models.filter(model => model.type === type).length;
      return {
        ...acc,
        [type]: modelCount
      };
    }, {});
  }

  getValidatorsFromModels(models: SurveyModel[]): string[] {
    return models.flatMap(model => Object.keys(model.validator));
  }

  get countTotalTemplateControls(): number {
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

  get surveyTemplateModels(): SurveyTemplateModel[] {
    return this.surveyNames.map(name => {
      return { name, models: this.getSurvey(name).createPredefinedSurvey() };
    });
  }
}