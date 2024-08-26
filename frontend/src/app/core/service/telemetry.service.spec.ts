import { TestBed } from '@angular/core/testing';

import { AppInsightsService } from './telemetry.service';

describe('TelemetryService', () => {
  let service: AppInsightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInsightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
