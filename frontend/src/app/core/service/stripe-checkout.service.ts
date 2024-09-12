import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StripeCheckoutService {
  stripe: Stripe | null = null;

  async initialize() {
    this.stripe = await loadStripe(environment.stripe.publicKey);
  }
}
