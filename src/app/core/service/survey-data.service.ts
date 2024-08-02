import { Injectable } from '@angular/core';
import { SurveyModelStorage } from '../../util/type/survey-type';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  getSurveyData(): SurveyModelStorage[] {
    const storageData = localStorage.getItem('surveyData') ?? "";
    const storage = JSON.parse(storageData) as SurveyModelStorage[];
    return storage;
  }
}