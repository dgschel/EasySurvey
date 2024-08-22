import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { SurveyModel } from '../../util/type/survey-type';
import { Submission } from '../../util/type/submission';
import { HttpWrapper } from '../../util/type/http';

@Injectable({
  providedIn: 'root'
})
export class AzureSurveyService {
  constructor(private httpService: HttpClient) { }

  fetchSurveyData(id: string) {
    return this.httpService
      .get<HttpWrapper<SurveyModel[]>>(environment.endpoints.readSurvey, { params: { id } })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // With this error handling, we can log the error to the console and return a new error
    // Example generate a new error with a user friendly message
    return throwError(() => new Error("Error fetching survey data", error));
  }

  saveSurveyData(surveyModels: SurveyModel[]) {
    return this.httpService.post<HttpWrapper<{ id: string }>>(environment.endpoints.saveSurvey, surveyModels);
  }

  saveSurveySubmission(submission: Submission) {
    return this.httpService.post<HttpWrapper<null>>(environment.endpoints.saveSubmission, submission);
  }
}
