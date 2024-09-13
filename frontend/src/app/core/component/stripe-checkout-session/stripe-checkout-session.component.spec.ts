import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeCheckoutSessionComponent } from './stripe-checkout-session.component';

describe('StripeCheckoutSessionComponent', () => {
  let component: StripeCheckoutSessionComponent;
  let fixture: ComponentFixture<StripeCheckoutSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeCheckoutSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeCheckoutSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
