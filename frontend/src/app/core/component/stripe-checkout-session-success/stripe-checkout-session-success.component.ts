import { Component, inject, Input, OnInit } from '@angular/core';

import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';

import { StripeCheckoutSessionStatus } from '../../../util/type/stripe';
import { BasicCardComponent } from '../../../shared/ui/basic-card/basic-card.component';
import { DisplayQrCodeComponent } from '../../../shared/ui/display-qr-code/display-qr-code.component';

@Component({
  selector: 'app-stripe-checkout-session-success',
  standalone: true,
  imports: [BasicCardComponent, DisplayQrCodeComponent, SvgIconComponent],
  templateUrl: './stripe-checkout-session-success.component.html',
  styleUrl: './stripe-checkout-session-success.component.scss'
})
export class StripeCheckoutSessionSuccessComponent implements OnInit {
  @Input({ required: true }) stripeCheckoutSession!: StripeCheckoutSessionStatus;
  private iconReg = inject(SvgIconRegistryService);

  ngOnInit(): void {
    this.iconReg.loadSvg('/svg/rosette-discount-check.svg', 'rosette-discount-check')?.subscribe();

    // Display the Stripe Checkout session status
    console.log('Stripe Checkout session status:', this.stripeCheckoutSession);
  }

  ngOnDestroy(): void {
    this.iconReg.unloadSvg('rosette-discount-check');
  }
}
