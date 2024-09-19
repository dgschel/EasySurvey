import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, Input, OnDestroy, ViewChild } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { StripeEmbeddedCheckout } from '@stripe/stripe-js';

import { BasicCardComponent } from "../../../shared/ui/basic-card/basic-card.component";
import { DisplayErrorMessageComponent } from '../../../shared/ui/display-error-message/display-error-message.component';

@Component({
  selector: 'app-stripe-embedded-checkout-form',
  standalone: true,
  imports: [BasicCardComponent, NgIf, AsyncPipe, RouterLink, DisplayErrorMessageComponent],
  templateUrl: './stripe-embedded-checkout-form.component.html',
  styleUrl: './stripe-embedded-checkout-form.component.scss',
})
export class StripeEmbeddedCheckoutFormComponent implements AfterViewInit, OnDestroy {
  // Stripe Checkout embedded form
  @Input({ required: true }) stripeEmbeddedCheckout: StripeEmbeddedCheckout | undefined = undefined;
  @ViewChild('checkout') checkout!: ElementRef<HTMLDivElement>;

  private cdr = inject(ChangeDetectorRef);

  errorMessage: string = '';

  ngAfterViewInit(): void {
    try {
      // Mount Stripe Checkout embedded form
      this.stripeEmbeddedCheckout?.mount(this.checkout.nativeElement);
    } catch (error) {
      // Destroy Stripe Checkout embedded form
      // Destroying the form is necessary to initialize a new checkout form instance
      this.stripeEmbeddedCheckout?.destroy();

      this.errorMessage = 'Fehler! Der Mount-Vorgang für das Stripe Checkout-Formular ist fehlgeschlagen';
      console.error('Error initializing Stripe Checkout:', error);
    }

    // Trigger change detection
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // Unmount and destroy Stripe Checkout embedded form
    if (this.checkout?.nativeElement && this.stripeEmbeddedCheckout) {
      this.stripeEmbeddedCheckout.unmount();
      this.stripeEmbeddedCheckout.destroy();
    }
  }
}
