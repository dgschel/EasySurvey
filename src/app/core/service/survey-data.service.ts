import { Injectable } from '@angular/core';
import { SurveyModelStorage, SurveyValidatorType } from '../../util/type/survey-type';
import { surveyValidatorMap } from '../../shared/form-validator/validators';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  getSurveyData(): SurveyModelStorage[] {
    const storageData = localStorage.getItem('surveyData') ?? "";
    const storage = JSON.parse(storageData) as SurveyModelStorage[];

    const entries = storage.map((entry: SurveyModelStorage) => {
      const validator = Object.keys(entry.validator).reduce((acc, curr) => {
        const validatorConfig = surveyValidatorMap[curr as SurveyValidatorType];
        const validatorFn = validatorConfig(entry.validator);
        return {
          ...acc,
          [curr]: validatorFn
        }
      }, {});

      return {
        ...entry,
        validator
      }
    });

    return entries;
  }
}