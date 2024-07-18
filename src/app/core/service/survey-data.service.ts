import { Injectable } from '@angular/core';
import { SurveyModel } from '../../util/type/survey-type';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  // TODO: Get survey data from API
  getSurveyData(): SurveyModel[] {
    const data: SurveyModel[] = [{
      type: 'input',
      placeholder: 'Name',
      required: true,
      title: '',
      description: '',
      validators: ['required', 'minLength']
    }, {
      type: 'select',
      required: true,
      options: ['10-20', '20-30'],
      title: '',
      description: '',
      validators: ['required']
    }];

    return data;
  }
}