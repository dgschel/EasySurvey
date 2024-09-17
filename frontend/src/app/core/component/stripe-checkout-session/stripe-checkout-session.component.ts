import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { HttpService } from '../../service/http.service';
import { environment } from '../../../../environments/environment';
import { StripeCheckoutSessionStatus } from '../../../util/type/stripe';

@Component({
  selector: 'app-stripe-checkout-session',
  standalone: true,
  imports: [],
  templateUrl: './stripe-checkout-session.component.html',
  styleUrl: './stripe-checkout-session.component.scss'
})
export class StripeCheckoutSessionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private httpService = inject(HttpService);

  ngOnInit(): void {
    // Fetch the session_id from the query parameters and check the status of the Stripe Checkout session
    this.route.queryParams.pipe(
      map(params => params['session_id']),
      switchMap((session_id: string) => this.httpService.get<StripeCheckoutSessionStatus>(environment.endpoints.stripeCheckoutSessionStatus, { session_id }))
    ).subscribe(response => {
      console.log('Stripe checkout session status:', response);
    })
  }
}
