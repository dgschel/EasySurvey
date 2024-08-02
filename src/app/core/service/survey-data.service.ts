import { Injectable } from '@angular/core';
import { SurveyModel } from '../../util/type/survey-type';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  getSurveyData(): SurveyModel[] {
    const storageData = localStorage.getItem('surveyData') ?? "";
    const storage = JSON.parse(storageData) as SurveyModel[];
    return storage;
  }
}