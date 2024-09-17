import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { catchError, EMPTY, map, Observable, switchMap } from 'rxjs';

import { HttpService } from '../../service/http.service';
import { environment } from '../../../../environments/environment';
import { LoadingComponent } from '../../../shared/ui/loading/loading.component';
import { StripeCheckoutSessionStatus } from '../../../util/type/stripe';
import { StripeCheckoutSessionSuccessComponent } from '../stripe-checkout-session-success/stripe-checkout-session-success.component';
import { StripeCheckoutSessionFailureComponent } from '../stripe-checkout-session-failure/stripe-checkout-session-failure.component';

@Component({
  selector: 'app-stripe-checkout-session',
  standalone: true,
  imports: [AsyncPipe, LoadingComponent, StripeCheckoutSessionSuccessComponent, StripeCheckoutSessionFailureComponent],
  templateUrl: './stripe-checkout-session.component.html',
  styleUrl: './stripe-checkout-session.component.scss'
})
export class StripeCheckoutSessionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private httpService = inject(HttpService);

  stripeCheckoutSession$: Observable<StripeCheckoutSessionStatus> = EMPTY;
  errorMessage: string = '';

  ngOnInit(): void {
    // Fetch the session_id from the query parameters and check the status of the Stripe Checkout session
    this.stripeCheckoutSession$ = this.route.queryParams.pipe(
      map(params => params['session_id']),
      switchMap((session_id: string) => this.httpService.get<StripeCheckoutSessionStatus>(environment.endpoints.stripeCheckoutSessionStatus, { session_id })),
      map(({ data }) => data),
      catchError(error => {
        this.errorMessage = 'Error fetching Stripe Checkout session status';
        console.error('Error fetching Stripe Checkout session status:', error);
        return EMPTY;
      })
    )
  }
}
