import { Component, Input, OnInit } from '@angular/core';
import { StripeCheckoutSessionStatus } from '../../../util/type/stripe';

@Component({
  selector: 'app-stripe-checkout-session-success',
  standalone: true,
  imports: [],
  templateUrl: './stripe-checkout-session-success.component.html',
  styleUrl: './stripe-checkout-session-success.component.scss'
})
export class StripeCheckoutSessionSuccessComponent implements OnInit {
  @Input({ required: true }) stripeCheckoutSession!: StripeCheckoutSessionStatus;

  ngOnInit(): void {
    // Display the Stripe Checkout session status
    console.log('Stripe Checkout session status:', this.stripeCheckoutSession);
  }
}
