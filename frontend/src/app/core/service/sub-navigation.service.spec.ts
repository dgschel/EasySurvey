import { TestBed } from '@angular/core/testing';

import { SubNavigationService } from './sub-navigation.service';

describe('SubNavigationService', () => {
  let service: SubNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
