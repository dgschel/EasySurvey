import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeConsentComponent } from './stripe-consent.component';

describe('StripeConsentComponent', () => {
  let component: StripeConsentComponent;
  let fixture: ComponentFixture<StripeConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeConsentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
