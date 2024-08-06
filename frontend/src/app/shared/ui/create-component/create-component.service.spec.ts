import { TestBed } from '@angular/core/testing';

import { CreateComponentService } from './create-component.service';

describe('CreateComponentService', () => {
  let service: CreateComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
