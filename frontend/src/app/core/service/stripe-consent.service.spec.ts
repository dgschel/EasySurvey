import { TestBed } from '@angular/core/testing';

import { StripeConsentService } from './stripe-consent.service';

describe('StripeConsentService', () => {
  let service: StripeConsentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeConsentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
