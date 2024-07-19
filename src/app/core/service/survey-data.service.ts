import { Injectable } from '@angular/core';
import { SurveyBaseStorage, SurveyBaseType, SurveyModel } from '../../util/type/survey-type';
import { surveyValidatorMap } from '../../shared/form-validator/validators';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  // TODO: Get survey data from API
  getSurveyData(): SurveyModel[] {
    const storageData = localStorage.getItem('surveyData') ?? "";
    const storage = JSON.parse(storageData) as SurveyBaseStorage[];

    const entries: SurveyBaseType[] = storage.map(entry => {
      const validationMap = entry.validator.reduce((acc, curr) => ({
        ...acc,
        [curr]: surveyValidatorMap[curr]
      }), {})

      return {
        ...entry,
        validator: validationMap
      }
    });

    return [];
  }
}