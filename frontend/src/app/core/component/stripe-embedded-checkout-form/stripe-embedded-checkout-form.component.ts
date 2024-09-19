import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';

import { StripeEmbeddedCheckout } from '@stripe/stripe-js';

import { BasicCardComponent } from "../../../shared/ui/basic-card/basic-card.component";

@Component({
  selector: 'app-stripe-embedded-checkout-form',
  standalone: true,
  imports: [BasicCardComponent, NgIf, AsyncPipe],
  templateUrl: './stripe-embedded-checkout-form.component.html',
  styleUrl: './stripe-embedded-checkout-form.component.scss'
})
export class StripeEmbeddedCheckoutFormComponent implements OnInit, OnDestroy {
  // Stripe Checkout embedded form
  @Input({ required: true }) stripeEmbeddedCheckout!: StripeEmbeddedCheckout;

  ngOnInit(): void {
    try {
      // Mount Stripe Checkout embedded form
      this.stripeEmbeddedCheckout.mount('#checkout');
    } catch (error) {
      console.error('Error initializing Stripe Checkout:', error);      
    }
  }

  ngOnDestroy(): void {
    // Unmount and destroy Stripe Checkout embedded form
    this.stripeEmbeddedCheckout.unmount();
    this.stripeEmbeddedCheckout.destroy();
  }
}
