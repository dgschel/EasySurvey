import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

import { EMPTY, from, switchMap, map, Observable, catchError, withLatestFrom, of, filter } from 'rxjs';

import { StripeCheckoutService } from '../../service/stripe-checkout.service';
import { HttpService } from '../../service/http.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-stripe-checkout',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './stripe-checkout.component.html',
  styleUrl: './stripe-checkout.component.scss'
})
export class StripeCheckoutComponent implements OnInit {
  private httpService = inject(HttpService);
  private stripeService = inject(StripeCheckoutService);
  private route = inject(ActivatedRoute);

  errorMessage: string = '';

  @ViewChild('checkout') stripeCheckoutElement!: ElementRef<HTMLDivElement>;

  checkout$: Observable<void> = EMPTY;

  ngOnInit() {
    // Fetch the survey id from the route and ensure it is valid
    const surveyId$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter((id): id is string => !!id), // Proceed only if surveyId is not null or empty
      catchError(error => {
        this.errorMessage = "Error fetching survey ID from route";
        console.error("Error fetching survey ID from route:", error);
        return EMPTY; // Stop further processing if surveyId is invalid
      })
    );

    // Fetch the payment status of the survey
    const surveyPaymentStatus$ = surveyId$.pipe(
      switchMap(surveyId => {
        const url = environment.endpoints.surveyPaymentStatus.replace('{surveyId}', surveyId);
        return this.httpService.get<{ status: string }>(url)
          .pipe(
            map(response => response?.data?.status || 'unknown'), // Ensure we have a valid status
            catchError(error => {
              this.errorMessage = "Survey not found or has been archived";
              console.error("Survey not found or has been archived:", error);
              return of('Survey not found or has been archived'); // Return a fallback value
            })
          )
      })
    );

    // Branch logic based on payment status
    const surveyStatusHandling$ = surveyPaymentStatus$.pipe(
      switchMap(status => {
        if (status === 'not paid') {
          return of(status); // Proceed with Stripe checkout flow
        } else if (status === 'paid') {
          this.errorMessage = "This survey has already been paid. Redirecting...";
          // Handle redirect or display additional message, return EMPTY to stop further processing
          return EMPTY;
        } else {
          this.errorMessage = "Unexpected survey payment status.";
          return EMPTY; // Stop further processing for any unexpected status
        }
      })
    );

    // Fetch the client secret and initialize the Stripe Checkout if survey status is 'not paid'
    this.checkout$ = surveyStatusHandling$.pipe(
      withLatestFrom(surveyId$), // Combine with surveyId to proceed
      switchMap(([_, surveyId]) =>
        this.stripeService.fetchClientSecret(surveyId).pipe(
          catchError(error => {
            this.errorMessage = "Error fetching client secret";
            console.error("Error fetching client secret:", error);
            return EMPTY; // Stop further processing if client secret cannot be fetched
          })
        )
      ),
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
      }),
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
