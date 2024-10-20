import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyStatisticComponent } from './survey-statistic.component';

describe('StatisticComponent', () => {
  let component: SurveyStatisticComponent;
  let fixture: ComponentFixture<SurveyStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
