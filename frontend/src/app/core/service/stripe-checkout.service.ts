import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StripeCheckoutService {
  private stripe: Stripe | null = null;

  constructor() {
    this.initialize().then((stripe) => {
      this.stripe = stripe;
    });
  }

  private async initialize() {
    return await loadStripe(environment.stripe.publicKey);
  }

  getStripeInstance(): Stripe | null {
    return this.stripe
  }
}
