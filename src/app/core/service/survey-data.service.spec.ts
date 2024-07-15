import { TestBed } from '@angular/core/testing';

import { SurveyDataService } from '../service/survey-data.service';

describe('SurveyDataService', () => {
  let service: SurveyDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
