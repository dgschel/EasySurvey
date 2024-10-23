import { Component, createComponent, ElementRef, EnvironmentInjector, inject, Input, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { catchError, delay, EMPTY, map, Observable, take } from 'rxjs';
import { SvgIconComponent } from 'angular-svg-icon';

import { StripeCheckoutSessionStatus } from '../../../util/type/stripe';
import { BasicCardComponent } from '../../../shared/ui/basic-card/basic-card.component';
import { DisplayQrCodeComponent } from '../../../shared/ui/display-qr-code/display-qr-code.component';
import { HttpService } from '../../service/http.service';
import { environment } from '../../../../environments/environment';
import { ConfettiService } from '../../service/confetti.service';
import { SurveyUpdatePaymentStatusFailedComponent } from '../../../shared/ui/template/modal/survey-update-payment-status-failed/survey-update-payment-status-failed.component';
import { ModalService } from '../../service/modal.service';
import { CopyToClipboardComponent } from "../../../shared/feature/copy-to-clipboard/copy-to-clipboard.component";

@Component({
  selector: 'app-stripe-checkout-session-success',
  standalone: true,
  imports: [BasicCardComponent, DisplayQrCodeComponent, SvgIconComponent, AsyncPipe, RouterLink, CopyToClipboardComponent],
  templateUrl: './stripe-checkout-session-success.component.html',
  styleUrl: './stripe-checkout-session-success.component.scss'
})
export class StripeCheckoutSessionSuccessComponent implements OnInit {
  @Input({ required: true }) stripeCheckoutSession!: StripeCheckoutSessionStatus;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  private confettiService = inject(ConfettiService);
  private httpService = inject(HttpService);
  private modalService = inject(ModalService);
  private environmentInjector = inject(EnvironmentInjector);

  qrCodeResponse$: Observable<string> = EMPTY;
  urlToSurvey: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    // Fetch the QR-Code for the survey
    const path = `/survey/${this.stripeCheckoutSession.surveyId}/view`;
    this.urlToSurvey = `${location.origin}/${path}`;
    this.qrCodeResponse$ = this.httpService.post<{ svg: string }>(environment.endpoints.createQRCode, { path }).pipe(
      map(({ data }) => data.svg),
      catchError(error => {
        this.errorMessage = "Es ist ein fehler beim Abrufen des QR-Codes für das Formular aufgetreten. Bitte versuchen Sie es später erneut";
        console.error("Error fetching QR-Code for survey:", error);
        return EMPTY;
      })
    )

    // Update the survey payment status
    const updateSurveyUrl = environment.endpoints.surveyPaymentStatus.replace('{surveyId}', this.stripeCheckoutSession.surveyId);
    this.httpService.put(updateSurveyUrl).pipe(
      take(1),
      delay(1000), // Delay the response to allow the confetti animation to finish
      catchError((error) => this.handleUpdateSurveyPaymentStatusError(error))
    ).subscribe();
  }

  private handleUpdateSurveyPaymentStatusError(error: any): Observable<never> {
    const cmp = createComponent(SurveyUpdatePaymentStatusFailedComponent, {
      environmentInjector: this.environmentInjector,
    });

    cmp.setInput('surveyId', this.stripeCheckoutSession.surveyId);

    const modal = this.modalService.open(cmp);
    modal.instance.modalCloseEvent.subscribe(() => this.modalService.close());

    return EMPTY;
  };

  ngAfterViewInit(): void {
    // Display the confetti animation. The canvas is resized to fit the window size and minus 32px padding
    this.canvas.nativeElement.width = window.innerWidth - 32;
    this.canvas.nativeElement.height = window.innerHeight;

    setTimeout(() => {
      this.confettiService.celebrate(this.canvas.nativeElement, {
        particleCount: 100,
        disableForReducedMotion: true,
        ticks: 100,
        spread: 60,
        origin: { y: 0.6 }
      })?.finally(() => {
        // Reset the canvas z-index to -10 to prevent it from blocking the UI
        this.canvas.nativeElement.style.zIndex = '-10';
      });

    }, 250);
  }
}
