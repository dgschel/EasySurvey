import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSurveyComponent } from './preview-survey.component';

describe('PreviewSurveyComponent', () => {
  let component: PreviewSurveyComponent;
  let fixture: ComponentFixture<PreviewSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewSurveyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
