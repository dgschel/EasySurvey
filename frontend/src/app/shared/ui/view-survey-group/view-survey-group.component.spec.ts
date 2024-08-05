import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSurveyGroupComponent } from './view-survey-group.component';

describe('ViewSurveyGroupComponent', () => {
  let component: ViewSurveyGroupComponent;
  let fixture: ComponentFixture<ViewSurveyGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSurveyGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSurveyGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
