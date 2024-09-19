import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { loadStripe, Stripe, StripeEmbeddedCheckout } from '@stripe/stripe-js';

import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';
import { HttpWrapper } from '../../util/type/http';

@Injectable({
  providedIn: 'root'
})
export class StripeCheckoutService {
  private httpService = inject(HttpService);
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

  fetchClientSecret(surveyId: string): Observable<HttpWrapper<{ clientSecret: string; sessionId: string; }>> {
    return this.httpService.post<{ clientSecret: string, sessionId: string }>(environment.endpoints.stripeCheckout, { id: surveyId });
  }

  async initEmbeddedCheckout(clientSecret: string): Promise<StripeEmbeddedCheckout> {
    if (!this.stripe) return Promise.reject('Stripe is not initialized');
    return await this.stripe.initEmbeddedCheckout({ clientSecret })
  }
}
