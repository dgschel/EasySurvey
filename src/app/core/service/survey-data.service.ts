import { Injectable } from '@angular/core';
import { SurveyModel } from '../../util/type/survey-type';
import { customRequiredValidator } from '../../shared/form-validator/validators';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  // TODO: Get survey data from API
  getSurveyData(): SurveyModel[] {
    const data: SurveyModel[] = [{
      type: 'input',
      placeholder: 'Name',
      title: '',
      description: '',
      validator: {
        required: customRequiredValidator('Name is required'),
      }
    }, {
      type: 'select',
      options: ['10-20', '20-30'],
      title: '',
      description: '',
      validator: {}
    }];

    return data;
  }
}