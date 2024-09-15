import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

import { catchError, EMPTY, filter, map, Observable, of, switchMap, withLatestFrom } from 'rxjs';

import { StripeCheckoutComponent } from '../core/component/stripe-checkout/stripe-checkout.component';
import { HttpService } from '../core/service/http.service';
import { environment } from '../../environments/environment';
import { SurveyPaymentStatus } from '../util/type/survey-type';
import { DisplayErrorMessageComponent } from '../shared/ui/display-error-message/display-error-message.component';

@Component({
  selector: 'app-survey-checkout',
  standalone: true,
  imports: [StripeCheckoutComponent, DisplayErrorMessageComponent, NgIf, AsyncPipe],
  templateUrl: './survey-checkout.component.html',
  styleUrl: './survey-checkout.component.scss'
})
export class SurveyCheckoutComponent implements OnInit {
  private httpService = inject(HttpService);
  private route = inject(ActivatedRoute);

  surveyStatusHandling$: Observable<{ surveyId: string }> = EMPTY;

  errorMessage: string = '';

  ngOnInit(): void {
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
        const url = environment.endpoints.surveyPaymentStatus.replace('{surveyId}', surveyId)
        return this.httpService.get<SurveyPaymentStatus>(url)
          .pipe(
            map(({ data }) => data.status),
            catchError(error => {
              this.errorMessage = "Survey not found or has been archived";
              console.error("Survey not found or has been archived:", error);
              
              const surveyPaymentStatus: SurveyPaymentStatus = { status: 'unknown' };
              return of(surveyPaymentStatus.status); // Return a fallback value
            })
          )
      })
    );

    // Branch logic based on payment status
    this.surveyStatusHandling$ = surveyPaymentStatus$.pipe(
      withLatestFrom(surveyId$),
      switchMap(([status, surveyId]) => {
        if (status === 'not paid') {
          return of({ surveyId }); // Proceed with Stripe checkout flow
        } else if (status === 'paid') {
          this.errorMessage = "This survey has already been paid. Redirecting...";
          // Handle redirect or display additional message, return EMPTY to stop further processing
          return EMPTY;
        } else {
          this.errorMessage = "Survey not found or has been archived";
          return EMPTY; // Stop further processing for any unexpected status
        }
      })
    );
  }
}
