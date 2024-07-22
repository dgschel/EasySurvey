import { Injectable } from '@angular/core';
import { SurveyModel, SurveyModelFromStorage } from '../../util/type/survey-type';
import { surveyValidatorMap } from '../../shared/form-validator/validators';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  getSurveyData(): SurveyModel[] {
    const storageData = localStorage.getItem('surveyData') ?? "";
    const storage = JSON.parse(storageData) as SurveyModelFromStorage[];

    const entries: SurveyModel[] = storage.map((entry: SurveyModelFromStorage) => {
      const validationMap = entry.validator.reduce((acc, curr) => ({
        ...acc,
        [curr]: surveyValidatorMap[curr]
      }), {})

      return {
        ...entry,
        validator: validationMap
      }
    });

    return entries
  }
}