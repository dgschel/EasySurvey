import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSurveyFormComponent } from './view-survey-form.component';

describe('ViewSurveyFormComponent', () => {
  let component: ViewSurveyFormComponent;
  let fixture: ComponentFixture<ViewSurveyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSurveyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSurveyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
