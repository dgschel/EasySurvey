import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';

import { EMPTY, from, switchMap, map, Observable, catchError, of } from 'rxjs';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';

import { StripeCheckoutService } from '../../service/stripe-checkout.service';
import { SurveyCheckoutComponent } from '../../../survey-checkout/survey-checkout.component';
import { DisplayErrorMessageComponent } from '../../../shared/ui/display-error-message/display-error-message.component';
import { BasicCardComponent } from "../../../shared/ui/basic-card/basic-card.component";
import { StripeEmbeddedCheckout } from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe-checkout',
  standalone: true,
  imports: [SurveyCheckoutComponent, NgIf, AsyncPipe, DisplayErrorMessageComponent, SvgIconComponent, BasicCardComponent],
  templateUrl: './stripe-checkout.component.html',
  styleUrl: './stripe-checkout.component.scss'
})
export class StripeCheckoutComponent implements OnInit, OnDestroy {
  @Input('surveyId') surveyId: string = '';

  private iconReg = inject(SvgIconRegistryService);
  private stripeService = inject(StripeCheckoutService);

  checkout$: Observable<void> = EMPTY;
  stripeEmbeddedCheckout: StripeEmbeddedCheckout | null = null;
  errorMessage: string = '';

  ngOnInit() {
    this.iconReg.loadSvg('/svg/stripe_wordmark.svg', 'stripe_wordmark')?.subscribe();

    // Fetch client secret for Stripe Checkout
    const fetchClientSecretObservable$ = this.stripeService.fetchClientSecret(this.surveyId).pipe(
      catchError(error => {
        this.errorMessage = "Fehler! Beim Abrufen des Client-Secrets ist ein Fehler aufgetreten";
        console.error("Error fetching client secret:", error);
        return EMPTY; // Stop further processing if client secret cannot be fetched
      })
    );

    // Initialize Stripe Checkout
    const initializedStripeCheckout$ = fetchClientSecretObservable$.pipe(
      switchMap(({ data }) => {
        if (!data || !data.clientSecret) {
          this.errorMessage = "Fehler! Ungültiges Client Secret für Stripe Checkout";
          console.error("Invalid client secret for Stripe Checkout");
          return EMPTY; // Ensure client secret is valid before proceeding
        }
        return from(this.stripeService.initEmbeddedCheckout(data.clientSecret)).pipe(
          catchError(error => {
            this.errorMessage = "Fehler beim Initialisieren von Stripe Checkout";
            console.error("Error initializing Stripe Checkout:", error);
            return EMPTY; // Stop further processing if Stripe Checkout initialization fails
          })
        );
      })
    );

    // Mount Stripe Checkout form
    this.checkout$ = initializedStripeCheckout$.pipe(
      map(checkout => {
        if (!checkout) {
          this.errorMessage = "Fehler! Stripe Checkout konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut";
          console.error("Error: Stripe checkout could not be initialized");
          return;
        }
        
        // Store the Stripe Checkout instance for cleanup
        this.stripeEmbeddedCheckout = checkout;

        return checkout.mount('#checkout'); // Mount Stripe checkout form if all is well
      }),
      catchError(error => {
        this.errorMessage = "Fehler! Beim Checkout-Prozess ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut";
        console.error("Error in the checkout process:", error);
        return of(error); // Handle any other unexpected errors
      })
    );
  }

  ngOnDestroy(): void {
    this.iconReg.unloadSvg('stripe_wordmark');

    // Unmount and destroy Stripe Checkout embedded form
    this.stripeEmbeddedCheckout?.unmount();
    this.stripeEmbeddedCheckout?.destroy();
  }
}
