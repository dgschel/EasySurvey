import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { EMPTY, filter, from, switchMap, map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

import { StripeCheckoutService } from '../../service/stripe-checkout.service';

@Component({
  selector: 'app-stripe-checkout',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './stripe-checkout.component.html',
  styleUrl: './stripe-checkout.component.scss'
})
export class StripeCheckoutComponent implements OnInit {
  private stripeService = inject(StripeCheckoutService);
  private route = inject(ActivatedRoute);

  @ViewChild('checkout') stripeCheckoutElement!: ElementRef<HTMLDivElement>;

  checkout$: Observable<void> = EMPTY;

  ngOnInit() {
    this.checkout$ = this.route.paramMap.pipe(
      filter(params => params.has('id')),
      map(params => params.get('id') as string),
      switchMap(surveyId => this.stripeService.fetchClientSecret(surveyId)),
      switchMap(({ data }) => from(this.stripeService.initEmbeddedCheckout(data.clientSecret))),
      map(checkout => checkout.mount(this.stripeCheckoutElement.nativeElement))
    )
  }
}
