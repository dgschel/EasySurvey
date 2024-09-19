import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeEmbeddedCheckoutFormComponent } from './stripe-embedded-checkout-form.component';

describe('StripeEmbeddedCheckoutFormComponent', () => {
  let component: StripeEmbeddedCheckoutFormComponent;
  let fixture: ComponentFixture<StripeEmbeddedCheckoutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripeEmbeddedCheckoutFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StripeEmbeddedCheckoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
