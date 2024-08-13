import { Injectable } from "@angular/core";
import { FormControlNameMap, FormControlType, FormValidatorNameMap, SurveyFormControlCount, SurveyModel, SurveyName, SurveyTemplateModel, SurveyValidatorType } from "../../util/type/survey-type";
import { SurveyTemplateContract } from "../types/survey-template-contract";
import { BasicSurveyTemplate } from "../templates/basic-survey-template";
import { PurchaseSurveyTemplate } from "../templates/purchase-survey-template";
import { EdekaSurveyTemplate } from "../templates/edeka-survey-template";

@Injectable({
  providedIn: 'root'
})
export class SurveyTemplateManager {
  private surveys: Record<SurveyName, SurveyTemplateContract> = {} as Record<SurveyName, SurveyTemplateContract>;

  private surveyInformation: Record<SurveyName, string> = {
    Standard: 'Standard survey template',
    Einkaufen: 'Purchase survey template for store form component',
    Edeka: 'Edeka survey template for store form component'
  };

  constructor() {
    this.addSurvey('Standard', new BasicSurveyTemplate());
    this.addSurvey('Einkaufen', new PurchaseSurveyTemplate());
    this.addSurvey('Edeka', new EdekaSurveyTemplate());
  }

  addSurvey(name: SurveyName, survey: SurveyTemplateContract) {
    this.surveys[name] = survey;
  }

  getSurvey(name: SurveyName): SurveyTemplateContract {
    return this.surveys[name];
  }

  getSurveyInformation(name: string): string {
    return this.surveyInformation[name as SurveyName];
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
    const result = this.getUniqueModelValidators(this.getSurvey(surveyName as SurveyName).createPredefinedSurvey());
    return result.map(validator => this.mapValidatorName(validator as SurveyValidatorType));
  }

  mapValidatorName(validator: SurveyValidatorType): string {
    return FormValidatorNameMap[validator];
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

  get countControlsBySurvey() {
    return this.surveyNames.reduce((acc, name) => {
      return {
        ...acc,
        [name]: this.getSurvey(name).createPredefinedSurvey().length
      }
    }, {} as Record<SurveyName, number>);
  }

  get surveyNames() {
    return Object.keys(this.surveys) as SurveyName[];
  }

  get surveyTemplateModels(): SurveyTemplateModel[] {
    return this.surveyNames.map(name => {
      return { name, models: this.getSurvey(name).createPredefinedSurvey() };
    });
  }
}