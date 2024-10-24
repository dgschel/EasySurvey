import { AfterViewInit, Component, DestroyRef, inject, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { EMPTY, from, switchMap, Observable, catchError, tap, filter, BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from 'angular-svg-icon';

import { StripeCheckoutService } from '../../service/stripe-checkout.service';
import { DisplayErrorMessageComponent } from '../../../shared/ui/display-error-message/display-error-message.component';
import { BasicCardComponent } from '../../../shared/ui/basic-card/basic-card.component';
import { StripeEmbeddedCheckoutFormComponent } from '../stripe-embedded-checkout-form/stripe-embedded-checkout-form.component';
import { LoadingComponent } from '../../../shared/ui/loading/loading.component';
import { StripeConsentComponent } from '../../../features/survey/components/stripe-consent/stripe-consent.component';
import { StripeConsentService } from '../../service/stripe-consent.service';

@Component({
  selector: 'app-stripe-checkout',
  standalone: true,
  imports: [
    AsyncPipe,
    DisplayErrorMessageComponent,
    SvgIconComponent,
    BasicCardComponent,
    StripeEmbeddedCheckoutFormComponent,
    LoadingComponent,
    StripeConsentComponent,
  ],
  templateUrl: './stripe-checkout.component.html',
  styleUrl: './stripe-checkout.component.scss',
})
export class StripeCheckoutComponent implements AfterViewInit {
  @Input('surveyId') surveyId: string = '';

  private stripeService = inject(StripeCheckoutService);
  private destroyRefService = inject(DestroyRef);

  stripeConsentService = inject(StripeConsentService);
  stripeConsent$ = new BehaviorSubject<boolean>(false); // Track the state of the consent to use Stripe

  checkout$: Observable<StripeEmbeddedCheckout> = EMPTY;
  errorMessage: string = '';

  ngAfterViewInit() {
    // Check if the user has given consent to use Stripe
    const stripeConsent$ = this.stripeConsentService
      .observeStripeConsent()
      .pipe(tap((consent) => this.stripeConsent$.next(consent)));

    // Fetch client secret for Stripe Checkout when consent is approved
    const fetchClientSecretObservable$ = stripeConsent$.pipe(
      filter((consent) => consent === true),
      switchMap(() =>
        this.stripeService.fetchClientSecret(this.surveyId).pipe(
          catchError((error) => {
            this.errorMessage = 'Fehler! Beim Abrufen des Client-Secrets ist ein Fehler aufgetreten';
            console.error('Error fetching client secret:', error);
            return EMPTY;
          }),
        ),
      ),
    );

    // Initialize Stripe Checkout
    const initStripeCheckout$ = fetchClientSecretObservable$.pipe(
      switchMap(({ data }) => {
        if (!data?.clientSecret) {
          this.errorMessage = 'Fehler! Ungültiges Client Secret für Stripe Checkout';
          console.error('Invalid client secret for Stripe Checkout');
          return EMPTY;
        }

        return from(this.stripeService.initEmbeddedCheckout(data.clientSecret)).pipe(
          catchError((error) => {
            this.errorMessage = 'Fehler! Beim Initialisieren von Stripe Checkout ist ein Fehler aufgetreten';
            console.error('Error initializing Stripe Checkout:', error);
            return EMPTY;
          }),
        );
      }),
    );

    // Subscribe to the initialized Stripe Checkout observable
    this.checkout$ = initStripeCheckout$.pipe(
      takeUntilDestroyed(this.destroyRefService),
      tap((checkout) => {
        if (!checkout) {
          this.errorMessage =
            'Fehler! Stripe Checkout konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut';
          console.error('Error: Stripe checkout could not be initialized');
        }
      }),
      catchError((error) => {
        this.errorMessage =
          'Fehler! Beim Checkout-Prozess ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut';
        console.error('Error in the checkout process:', error);
        return EMPTY;
      }),
    );
  }
}
