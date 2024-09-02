import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyStatisticDiagrammComponent } from './survey-statistic-diagramm.component';

describe('SurveyStatisticDiagrammComponent', () => {
  let component: SurveyStatisticDiagrammComponent;
  let fixture: ComponentFixture<SurveyStatisticDiagrammComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyStatisticDiagrammComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyStatisticDiagrammComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
