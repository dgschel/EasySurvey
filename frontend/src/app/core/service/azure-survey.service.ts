import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.development';
import { SurveyModel } from '../../util/type/survey-type';

@Injectable({
  providedIn: 'root'
})
export class AzureSurveyService {
  constructor(private httpService: HttpClient) { }

  fetchSurveyData(id: string) {
    return this.httpService.get<{ message: string, data: SurveyModel[] }>(environment.endpoints.readSurvey, { params: { id } });
  }

  saveSurveyData(data: SurveyModel[]) {
    return this.httpService.post<{ message: string }>(environment.endpoints.saveSurvey, data);
  }
}
