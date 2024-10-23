import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { catchError, EMPTY, map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { HttpService } from '../../../core/service/http.service';
import { DisplayQrCodeComponent } from '../display-qr-code/display-qr-code.component';
import { DisplayErrorMessageComponent } from '../display-error-message/display-error-message.component';
import { BasicCardComponent } from '../basic-card/basic-card.component';
import { CopyToClipboardComponent } from "../../feature/copy-to-clipboard/copy-to-clipboard.component";

@Component({
  selector: 'app-display-already-paid',
  standalone: true,
  imports: [DisplayQrCodeComponent, DisplayErrorMessageComponent, AsyncPipe, BasicCardComponent, RouterLink, CopyToClipboardComponent],
  templateUrl: './display-already-paid.component.html',
  styleUrl: './display-already-paid.component.scss'
})
export class DisplayAlreadyPaidComponent implements OnInit {
  @Input('surveyId') surveyId: string = '';
  urlToSurvey: string = '';

  private httpService = inject(HttpService);
  qrCodeResponse$: Observable<string> = EMPTY;
  errorMessage: string = '';

  ngOnInit(): void {
    // Fetch the QR-Code for the survey
    const path = `survey/${this.surveyId}/view`;
    this.urlToSurvey = `${location.origin}/survey/${this.surveyId}/view`;
    this.qrCodeResponse$ = this.httpService.post<{ svg: string }>(environment.endpoints.createQRCode, { path }).pipe(
      map(({ data }) => data.svg),
      catchError(error => {
        this.errorMessage = "Es ist ein fehler beim Abrufen des QR-Codes für das Formular aufgetreten. Bitte versuchen Sie es später erneut";
        console.error("Error fetching QR-Code for survey:", error);
        return EMPTY;
      })
    );
  }
}
