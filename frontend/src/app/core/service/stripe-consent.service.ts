import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeConsentService {
  private stripeConsent = new BehaviorSubject<boolean>(false);

  observeStripeConsent = (): Observable<boolean> => this.stripeConsent.asObservable();
  setStripeConsent = (consent: boolean) => {
    this.stripeConsent.next(consent);
    this.setStripeConsentToLocalStorage(consent);
  };

  constructor() {
    const stripeConsent = this.getStripeConsentFromLocalStorage();
    this.stripeConsent.next(Boolean(stripeConsent));
  }

  // ----- There can be a dedicated localStorage service  -----

  // For simplicity, we retrieve the consent from local storage
  getStripeConsentFromLocalStorage = (): string => JSON.parse(localStorage.getItem('stripeConsent') || 'false');

  // For simplicity, we store the consent in local storage
  setStripeConsentToLocalStorage = (consent: boolean) => localStorage.setItem('stripeConsent', JSON.stringify(consent));
}
