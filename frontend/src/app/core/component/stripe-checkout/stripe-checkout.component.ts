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

  @ViewChild('checkout') stripeCheckoutElement!: ElementRef<HTMLDivElement>;

  checkout$: Observable<void> = EMPTY;

  ngOnInit() {
    // Fetch the survey id from the route and ensure it is valid
    const surveyId$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      filter((id): id is string => !!id), // Proceed only if surveyId is not null or empty
      catchError(error => {
        console.error("Error fetching survey ID from route:", error);
        return EMPTY; // Stop further processing if surveyId is invalid
      })
    );

    // Fetch the payment status of the survey
    const surveyPaymentStatus$ = surveyId$.pipe(
      switchMap(surveyId =>
        this.httpService.get<{ status: string }>(environment.endpoints.surveyPaymentStatus, { params: { surveyId } }).pipe(
          map(response => response?.data?.status || 'unknown'), // Ensure we have a valid status
          catchError(error => {
            console.error("Error fetching payment status:", error);
            return of('Error fetching payment status'); // Return a fallback value
          })
        )
      )
    );

    // Filter to proceed only if the payment status is 'not paid'
    const surveyPaymentStatusNotPaid$ = surveyPaymentStatus$.pipe(
      filter(status => status === 'not paid'), // Only proceed if status is 'not paid'
      catchError(error => {
        console.error("Unexpected error in filtering payment status:", error);
        return EMPTY; // Stop further processing if an unexpected error occurs
      })
    );

    // Fetch the client secret and initialize the Stripe Checkout if survey status is 'not paid'
    this.checkout$ = surveyPaymentStatusNotPaid$.pipe(
      withLatestFrom(surveyId$), // Combine with surveyId to proceed
      switchMap(([_, surveyId]) =>
        this.stripeService.fetchClientSecret(surveyId).pipe(
          catchError(error => {
            console.error("Error fetching client secret:", error);
            return EMPTY; // Stop further processing if client secret cannot be fetched
          })
        )
      ),
      switchMap(({ data }) => {
        if (!data || !data.clientSecret) {
          console.error("Invalid client secret");
          return EMPTY; // Ensure client secret is valid before proceeding
        }
        return from(this.stripeService.initEmbeddedCheckout(data.clientSecret)).pipe(
          catchError(error => {
            console.error("Error initializing Stripe Checkout:", error);
            return EMPTY; // Stop further processing if Stripe Checkout initialization fails
          })
        );
      }),
      map(checkout => {
        if (!checkout) {
          console.error("Error: Stripe checkout could not be initialized.");
          return;
        }
        return checkout.mount(this.stripeCheckoutElement.nativeElement); // Mount Stripe checkout form if all is well
      }),
      catchError(error => {
        console.error("Error in the checkout process:", error);
        return of(error); // Handle any other unexpected errors
      })
    );
  }
}
