import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCheckoutSessionFailureComponent } from './stripe-checkout-session-failure.component';

describe('StripeCheckoutSessionFailureComponent', () => {
  let component: StripeCheckoutSessionFailureComponent;
  let fixture: ComponentFixture<StripeCheckoutSessionFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeCheckoutSessionFailureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeCheckoutSessionFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
