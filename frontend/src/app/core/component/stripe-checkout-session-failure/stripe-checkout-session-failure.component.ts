import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stripe-checkout-session-failure',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './stripe-checkout-session-failure.component.html',
  styleUrl: './stripe-checkout-session-failure.component.scss'
})
export class StripeCheckoutSessionFailureComponent {
  @Input({ required: true }) surveyId: string = '';
}
