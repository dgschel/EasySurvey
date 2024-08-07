import { TestBed } from '@angular/core/testing';

import { AzureSurveyService } from './azure-survey.service';

describe('AzureSurveyService', () => {
  let service: AzureSurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureSurveyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
