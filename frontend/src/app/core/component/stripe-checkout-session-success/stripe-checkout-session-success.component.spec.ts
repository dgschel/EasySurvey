import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCheckoutSessionSuccessComponent } from './stripe-checkout-session-success.component';

describe('StripeCheckoutSessionSuccessComponent', () => {
  let component: StripeCheckoutSessionSuccessComponent;
  let fixture: ComponentFixture<StripeCheckoutSessionSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeCheckoutSessionSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeCheckoutSessionSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
