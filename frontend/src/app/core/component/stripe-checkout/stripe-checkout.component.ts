import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

import { EMPTY, from, switchMap, map, Observable, catchError, withLatestFrom, of, filter } from 'rxjs';

import { StripeCheckoutService } from '../../service/stripe-checkout.service';
import { HttpService } from '../../service/http.service';
import { environment } from '../../../../environments/environment';
import { SurveyCheckoutComponent } from '../../../survey-checkout/survey-checkout.component';
import { DisplayErrorMessageComponent } from '../../../shared/ui/display-error-message/display-error-message.component';

@Component({
  selector: 'app-stripe-checkout',
  standalone: true,
  imports: [SurveyCheckoutComponent, NgIf, AsyncPipe, DisplayErrorMessageComponent],
  templateUrl: './stripe-checkout.component.html',
  styleUrl: './stripe-checkout.component.scss'
})
export class StripeCheckoutComponent implements OnInit {
  @Input('surveyId') surveyId: string = '';

  private stripeService = inject(StripeCheckoutService);
  @ViewChild('checkout') stripeCheckoutElement!: ElementRef<HTMLDivElement>;

  checkout$: Observable<void> = EMPTY;
  errorMessage: string = '';

  ngOnInit() {
    // Fetch client secret for Stripe Checkout
    const fetchClientSecretObservable$ = this.stripeService.fetchClientSecret(this.surveyId).pipe(
      catchError(error => {
        this.errorMessage = "Error fetching client secret";
        console.error("Error fetching client secret:", error);
        return EMPTY; // Stop further processing if client secret cannot be fetched
      })
    );

    // Initialize Stripe Checkout
    const initializedStripeCheckout$ = fetchClientSecretObservable$.pipe(
      switchMap(({ data }) => {
        if (!data || !data.clientSecret) {
          this.errorMessage = "Invalid client secret for Stripe Checkout";
          console.error("Invalid client secret for Stripe Checkout");
          return EMPTY; // Ensure client secret is valid before proceeding
        }
        return from(this.stripeService.initEmbeddedCheckout(data.clientSecret)).pipe(
          catchError(error => {
            this.errorMessage = "Error initializing Stripe Checkout";
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
          this.errorMessage = "Stripe checkout could not be initialized";
          console.error("Error: Stripe checkout could not be initialized");
          return;
        }
        return checkout.mount(this.stripeCheckoutElement.nativeElement); // Mount Stripe checkout form if all is well
      }),
      catchError(error => {
        this.errorMessage = "Error in the checkout process";
        console.error("Error in the checkout process:", error);
        return of(error); // Handle any other unexpected errors
      })
    );
  }
}
