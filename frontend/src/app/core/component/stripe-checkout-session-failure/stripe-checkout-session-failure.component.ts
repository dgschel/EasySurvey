import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';

@Component({
  selector: 'app-stripe-checkout-session-failure',
  standalone: true,
  imports: [RouterLink, SvgIconComponent],
  templateUrl: './stripe-checkout-session-failure.component.html',
  styleUrl: './stripe-checkout-session-failure.component.scss'
})
export class StripeCheckoutSessionFailureComponent {
  @Input({ required: true }) surveyId: string = '';
  private iconReg = inject(SvgIconRegistryService);

  ngOnInit(): void {
    this.iconReg.loadSvg('/svg/rosette-discount-check-off.svg', 'rosette-discount-check-off')?.subscribe();
  }

  ngOnDestroy(): void {
    this.iconReg.unloadSvg('rosette-discount-check-off');
  }
}
