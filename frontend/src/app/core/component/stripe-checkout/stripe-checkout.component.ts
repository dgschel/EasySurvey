import { Component, inject, OnInit } from '@angular/core';

import { StripeCheckoutService } from '../../service/stripe-checkout.service';

@Component({
  selector: 'app-stripe-checkout',
  standalone: true,
  imports: [],
  templateUrl: './stripe-checkout.component.html',
  styleUrl: './stripe-checkout.component.scss'
})
export class StripeCheckoutComponent implements OnInit {
  private stripeService = inject(StripeCheckoutService);

  ngOnInit() {
    const stripe = this.stripeService.getStripeInstance();
  }
}
