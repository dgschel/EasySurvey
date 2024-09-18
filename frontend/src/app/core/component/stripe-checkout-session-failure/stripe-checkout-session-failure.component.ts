import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DisplayErrorMessageComponent } from '../../../shared/ui/display-error-message/display-error-message.component';

@Component({
  selector: 'app-stripe-checkout-session-failure',
  standalone: true,
  imports: [RouterLink, DisplayErrorMessageComponent],
  templateUrl: './stripe-checkout-session-failure.component.html',
  styleUrl: './stripe-checkout-session-failure.component.scss'
})
export class StripeCheckoutSessionFailureComponent {
  @Input({ required: true }) surveyId: string = '';
}
