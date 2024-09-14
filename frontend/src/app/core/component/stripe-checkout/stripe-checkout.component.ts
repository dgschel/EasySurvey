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
    // Fetch the client secret from the server and initialize the Stripe Checkout with a session
    // Pass the survey id as a parameter to the route
    // The checkout$ observable is used to render the Stripe Checkout
    this.checkout$ = this.route.paramMap.pipe(
      filter(params => params.has('id')),
      map(params => params.get('id') as string),
      switchMap(surveyId => this.stripeService.fetchClientSecret(surveyId)),
      switchMap(({ data }) => from(this.stripeService.initEmbeddedCheckout(data.clientSecret))),
      map(checkout => checkout.mount(this.stripeCheckoutElement.nativeElement))
    )
  }
}
