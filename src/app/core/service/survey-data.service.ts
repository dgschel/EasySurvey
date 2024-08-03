import { inject, Injectable } from '@angular/core';
import { SurveyModel, SurveyTemplateModel } from '../../util/type/survey-type';
import { BehaviorSubject } from 'rxjs';
import { SurveyTemplateManager } from '../model/survey-template-manager';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  private surveyManager = inject(SurveyTemplateManager);

  private randomData = new BehaviorSubject<SurveyTemplateModel[]>([]);
  randomData$ = this.randomData.asObservable();

  getSurveyData(): SurveyModel[] {
    const storageData = localStorage.getItem('surveyData') ?? "";
    const storage = JSON.parse(storageData) as SurveyModel[];
    return storage;
  }

  constructor() {
    this.randomData.next([...this.surveyManager.surveyTemplateModels, {
      name: '123456', models: [
        { type: 'input', description: 'Random input', title: 'Random Title', validator: {} },
      ]
    }]);
  }

  fetchSurveyData(id: string): SurveyModel[] | undefined {
    return this.randomData.value.find(data => data.name === id)?.models
  }
}