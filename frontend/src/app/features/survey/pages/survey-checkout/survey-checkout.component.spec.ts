import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyCheckoutComponent } from './survey-checkout.component';

describe('SurveyCheckoutComponent', () => {
  let component: SurveyCheckoutComponent;
  let fixture: ComponentFixture<SurveyCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
