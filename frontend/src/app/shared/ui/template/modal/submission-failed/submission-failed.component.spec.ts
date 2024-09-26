import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionFailedComponent } from './submission-failed.component';

describe('SubmissionFailedComponent', () => {
  let component: SubmissionFailedComponent;
  let fixture: ComponentFixture<SubmissionFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionFailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
