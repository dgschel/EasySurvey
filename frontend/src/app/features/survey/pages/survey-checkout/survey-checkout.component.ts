import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

import { catchError, EMPTY, filter, map, merge, Observable, shareReplay, switchMap, withLatestFrom } from 'rxjs';

import { StripeCheckoutComponent } from '../../../../core/component/stripe-checkout/stripe-checkout.component';
import { HttpService } from '../../../../core/service/http.service';
import { environment } from '../../../../../environments/environment';
import { SurveyPaymentStatus } from '../../../../util/type/survey-type';
import { DisplayErrorMessageComponent } from '../../../../shared/ui/display-error-message/display-error-message.component';
import { DisplayAlreadyPaidComponent } from '../../../../shared/ui/display-already-paid/display-already-paid.component';
import { LoadingComponent } from '../../../../shared/ui/loading/loading.component';

@Component({
  selector: 'app-survey-checkout',
  standalone: true,
  imports: [StripeCheckoutComponent, DisplayErrorMessageComponent, DisplayAlreadyPaidComponent, NgIf, AsyncPipe, RouterLink, LoadingComponent],
  templateUrl: './survey-checkout.component.html',
  styleUrl: './survey-checkout.component.scss'
})
export class SurveyCheckoutComponent implements OnInit {
  private httpService = inject(HttpService);
  private route = inject(ActivatedRoute);

  surveyStatusHandling$: Observable<{ status: SurveyPaymentStatus['status'], surveyId: string }> = EMPTY;

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
              this.errorMessage = "Umfrage nicht gefunden oder wurde archiviert";
              console.error("Survey not found or has been archived", error);
              return EMPTY; // Stop further processing if survey is not found, corrupted or has been archived
            })
          )
      }),
      shareReplay(1) // Ensure that the payment request is shared across multiple subscribers
    );

    // Handle case where survey has not been paid
    // Proceed to Stripe Checkout
    const notPaid$ = surveyPaymentStatus$.pipe(
      withLatestFrom(surveyId$),
      filter(([status]) => status === 'not paid'),
      map(([status, surveyId]) => ({ status, surveyId }))
    );

    // Handle case where survey has already been paid
    const paid$ = surveyPaymentStatus$.pipe(
      withLatestFrom(surveyId$),
      filter(([status]) => status === 'paid'),
      map(([status, surveyId]) => ({ status, surveyId })),
    );

    this.surveyStatusHandling$ = merge(notPaid$, paid$);
  }
}
