import { Component, inject, Input, OnInit } from '@angular/core';
import { HttpService } from '../../../core/service/http.service';
import { DisplayQrCodeComponent } from '../display-qr-code/display-qr-code.component';
import { environment } from '../../../../environments/environment';
import { EMPTY, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-display-already-paid',
  standalone: true,
  imports: [DisplayQrCodeComponent, AsyncPipe],
  templateUrl: './display-already-paid.component.html',
  styleUrl: './display-already-paid.component.scss'
})
export class DisplayAlreadyPaidComponent implements OnInit {
  @Input('surveyId') surveyId: string = '';

  private httpService = inject(HttpService);
  qrCodeResponse$: Observable<string> = EMPTY;

  ngOnInit(): void {
    // Display message with QR-Code indicating that the survey has already been paid
    console.log(`Survey with id ${this.surveyId} has already been paid`);

    // Fetch the QR-Code for the survey
    const path = `survey/${this.surveyId}/viewform`;
    this.qrCodeResponse$ = this.httpService.post<{ svg: string }>(environment.endpoints.createQRCode, { path }).pipe(map(({ data }) => data.svg));
  }
}
