import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyPaidFormComponent } from './survey-paid-form.component';

describe('SurveyPaidFormComponent', () => {
  let component: SurveyPaidFormComponent;
  let fixture: ComponentFixture<SurveyPaidFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyPaidFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyPaidFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
