import { Component, DestroyRef, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { StripeEmbeddedCheckout } from '@stripe/stripe-js';
import {
  EMPTY,
  from,
  switchMap,
  Observable,
  catchError,
  of,
  map,
  tap,
  interval,
  take,
  finalize,
  BehaviorSubject,
  combineLatest,
  startWith,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from 'angular-svg-icon';

import { StripeCheckoutService } from '../../service/stripe-checkout.service';
import { DisplayErrorMessageComponent } from '../../../shared/ui/display-error-message/display-error-message.component';
import { BasicCardComponent } from '../../../shared/ui/basic-card/basic-card.component';
import { StripeEmbeddedCheckoutFormComponent } from '../stripe-embedded-checkout-form/stripe-embedded-checkout-form.component';
import { LoadingComponent } from '../../../shared/ui/loading/loading.component';

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
  ],
  templateUrl: './stripe-checkout.component.html',
  styleUrl: './stripe-checkout.component.scss',
})
export class StripeCheckoutComponent implements OnInit {
  @Input('surveyId') surveyId: string = '';
  @ViewChild('consentButton', { static: true }) consentButton!: ElementRef<HTMLButtonElement>;

  private stripeService = inject(StripeCheckoutService);
  private destroyRefService = inject(DestroyRef);

  checkout$: Observable<StripeEmbeddedCheckout> = EMPTY;
  errorMessage: string = '';

  countdownValue$ = new BehaviorSubject<number>(3);
  isButtonDisabled$ = new BehaviorSubject<boolean>(true);
  buttonText: string = '';

  ngOnInit() {
    // Fetch client secret for Stripe Checkout
    const fetchClientSecretObservable$ = this.stripeService.fetchClientSecret(this.surveyId).pipe(
      catchError((error) => {
        this.errorMessage = 'Fehler! Beim Abrufen des Client-Secrets ist ein Fehler aufgetreten';
        console.error('Error fetching client secret:', error);
        return EMPTY; // Stop further processing if client secret cannot be fetched
      }),
    );

    // Initialize Stripe Checkout
    const initializedStripeCheckout$ = fetchClientSecretObservable$.pipe(
      switchMap(({ data }) => {
        if (!data || !data.clientSecret) {
          this.errorMessage = 'Fehler! Ungültiges Client Secret für Stripe Checkout';
          console.error('Invalid client secret for Stripe Checkout');
          return EMPTY; // Ensure client secret is valid before proceeding
        }
        return from(this.stripeService.initEmbeddedCheckout(data.clientSecret)).pipe(
          catchError((error) => {
            this.errorMessage = 'Fehler! Beim Initialisieren von Stripe Checkout ist ein Fehler aufgetreten';
            console.error('Error initializing Stripe Checkout:', error);
            return EMPTY; // Stop further processing if Stripe Checkout initialization fails
          }),
        );
      }),
    );

    // Subscribe to the initialized Stripe Checkout observable
    this.checkout$ = initializedStripeCheckout$.pipe(
      switchMap((checkout) => {
        if (!checkout) {
          this.errorMessage =
            'Fehler! Stripe Checkout konnte nicht initialisiert werden. Bitte versuchen Sie es später erneut';
          console.error('Error: Stripe checkout could not be initialized');
          return EMPTY; // Stop further processing if Stripe Checkout initialization fails
        }

        return of(checkout); // Return the initialized Stripe Checkout
      }),
      catchError((error) => {
        this.errorMessage =
          'Fehler! Beim Checkout-Prozess ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut';
        console.error('Error in the checkout process:', error);
        return EMPTY; // Stop further processing if checkout process fails
      }),
    );
  }
}
