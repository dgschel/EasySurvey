import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySuccessfullySavedComponent } from './survey-successfully-saved.component';

describe('SurveySuccessfullySavedComponent', () => {
  let component: SurveySuccessfullySavedComponent;
  let fixture: ComponentFixture<SurveySuccessfullySavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveySuccessfullySavedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveySuccessfullySavedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
