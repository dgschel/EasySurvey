import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyCreationFailedComponent } from './survey-creation-failed.component';

describe('SurveyCreationFailedComponent', () => {
  let component: SurveyCreationFailedComponent;
  let fixture: ComponentFixture<SurveyCreationFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyCreationFailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyCreationFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
