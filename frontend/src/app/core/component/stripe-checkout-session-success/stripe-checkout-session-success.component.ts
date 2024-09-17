import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { catchError, EMPTY, map, Observable } from 'rxjs';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';

import { StripeCheckoutSessionStatus } from '../../../util/type/stripe';
import { BasicCardComponent } from '../../../shared/ui/basic-card/basic-card.component';
import { DisplayQrCodeComponent } from '../../../shared/ui/display-qr-code/display-qr-code.component';
import { HttpService } from '../../service/http.service';
import { environment } from '../../../../environments/environment';
import { ConfettiService } from '../../service/confetti.service';

@Component({
  selector: 'app-stripe-checkout-session-success',
  standalone: true,
  imports: [BasicCardComponent, DisplayQrCodeComponent, SvgIconComponent, AsyncPipe, RouterLink],
  templateUrl: './stripe-checkout-session-success.component.html',
  styleUrl: './stripe-checkout-session-success.component.scss'
})
export class StripeCheckoutSessionSuccessComponent implements OnInit {
  @Input({ required: true }) stripeCheckoutSession!: StripeCheckoutSessionStatus;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  private confettiService = inject(ConfettiService);
  private iconReg = inject(SvgIconRegistryService);
  private httpService = inject(HttpService);
  qrCodeResponse$: Observable<string> = EMPTY;

  ngOnInit(): void {
    this.iconReg.loadSvg('/svg/rosette-discount-check.svg', 'rosette-discount-check')?.subscribe();

    // Display the Stripe Checkout session status
    console.log('Stripe Checkout session status:', this.stripeCheckoutSession);

    // Fetch the QR-Code for the survey
    const path = `survey/${this.stripeCheckoutSession.surveyId}/viewform`;
    this.qrCodeResponse$ = this.httpService.post<{ svg: string }>(environment.endpoints.createQRCode, { path }).pipe(
      map(({ data }) => data.svg),
      catchError(error => {
        console.error("Error fetching QR-Code for survey:", error);
        return EMPTY;
      })
    )
  }

  ngAfterViewInit(): void {
    // Display the confetti animation. The canvas is resized to fit the window size and minus 32px padding
    this.canvas.nativeElement.width = window.innerWidth - 32;
    this.canvas.nativeElement.height = window.innerHeight;

    setTimeout(() => {
      this.confettiService.celebrate(this.canvas.nativeElement)
    }, 750);
  }

  ngOnDestroy(): void {
    this.iconReg.unloadSvg('rosette-discount-check');
  }
}
