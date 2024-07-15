import { Injectable, signal } from '@angular/core';
import { BaseSurveyFormControl } from '../model/base-form-control';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  surveyDataState = signal<SurveyDataModel[]>([]);

  saveModel(data: SurveyDataModel) {
    this.surveyDataState.update(state => {
      const index = state.findIndex(survey => survey.control === data.control);
      if (index === -1) return [...state, data];

      state[index] = data;
      return state;
    });
    localStorage.setItem('surveyData', JSON.stringify(this.surveyDataState()));
  }

  removeModel(model: SurveyDataModel) {
    const filtered = this.surveyDataState().filter(s => s.control !== model.control)
    this.surveyDataState.set(filtered);
    localStorage.setItem('surveyData', JSON.stringify(this.surveyDataState()));
  }
}

export type SurveyDataModel = {
  text: string;
  required: boolean;
  control: BaseSurveyFormControl;
}
