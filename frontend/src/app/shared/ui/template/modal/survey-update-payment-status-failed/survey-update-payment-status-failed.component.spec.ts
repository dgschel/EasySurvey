import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyUpdatePaymentStatusFailedComponent } from './survey-update-payment-status-failed.component';

describe('SurveyUpdatePaymentStatusFailedComponent', () => {
  let component: SurveyUpdatePaymentStatusFailedComponent;
  let fixture: ComponentFixture<SurveyUpdatePaymentStatusFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyUpdatePaymentStatusFailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyUpdatePaymentStatusFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
