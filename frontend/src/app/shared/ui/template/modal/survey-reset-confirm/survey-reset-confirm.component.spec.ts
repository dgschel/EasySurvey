import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyResetConfirmComponent } from './survey-reset-confirm.component';

describe('SurveyResetConfirmComponent', () => {
  let component: SurveyResetConfirmComponent;
  let fixture: ComponentFixture<SurveyResetConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyResetConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyResetConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
