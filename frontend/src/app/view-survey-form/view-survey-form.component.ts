import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { catchError, EMPTY, filter, map, merge, Observable, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs';

import { BasicCardComponent } from "../shared/ui/basic-card/basic-card.component";
import { SurveyModel, SurveyPaymentStatus } from '../util/type/survey-type';
import { environment } from '../../environments/environment';
import { HttpService } from '../core/service/http.service';
import { LoadingComponent } from '../shared/ui/loading/loading.component';
import { CopyToClipboardComponent } from "../shared/feature/copy-to-clipboard/copy-to-clipboard.component";
import { GeneralMessageComponent } from '../shared/ui/general-message/general-message.component';
import { DisplayErrorMessageComponent } from "../shared/ui/display-error-message/display-error-message.component";
import { SurveyPaidFormComponent } from "../core/component/survey-paid-form/survey-paid-form.component";

@Component({
  selector: 'app-view-survey-form',
  standalone: true,
  imports: [
    BasicCardComponent,
    AsyncPipe,
    GeneralMessageComponent,
    RouterLink,
    LoadingComponent,
    CopyToClipboardComponent,
    DisplayErrorMessageComponent,
    SurveyPaidFormComponent
],
  templateUrl: './view-survey-form.component.html',
  styleUrl: './view-survey-form.component.scss',
})
export class ViewSurveyFormComponent implements OnInit {
  private httpService = inject(HttpService);
  private activatedRoute = inject(ActivatedRoute);

  surveyHandler$: Observable<{ status: SurveyPaymentStatus['status'], models: SurveyModel[] }> = EMPTY;
  surveyId: string = "";
  isLoading = true;

  ngOnInit(): void {
    const surveyId$ = this.activatedRoute.paramMap.pipe(
      map(params => params.get('id') || ''),
      tap(surveyId => this.surveyId = surveyId), // Store the surveyId
    )

    const surveyPaymentStatus$ = surveyId$.pipe(
      map(surveyId => environment.endpoints.surveyPaymentStatus.replace('{surveyId}', surveyId)),
      switchMap(url => this.httpService.get<SurveyPaymentStatus>(url)
        .pipe(
          catchError(() => {
            console.log("Error fetching survey payment status");
            this.isLoading = false;
            return EMPTY; // Return an empty observable
          })
        )),
      map(({ data }) => data.status),
      shareReplay(1) // Ensure that only one request is made to the server for the payment status when multiple subscribers are present
    )

    const paidSurvey$ = surveyPaymentStatus$.pipe(
      withLatestFrom(surveyId$),
      filter(([status]) => status === "paid"),
      switchMap(([_, id]) => this.httpService.get<SurveyModel[]>(environment.endpoints.readSurvey, { id })
        .pipe(
          catchError(() => {
            console.log("Error fetching survey data");
            this.isLoading = false;
            return EMPTY;
          })
        )
      ),
      map(({ data }) => ({ status: "paid" as SurveyPaymentStatus['status'], models: data })),
    )

    // Survey has not been paid then display modal with an action button to redirect to payment page
    const notPaidSurvey$ = surveyPaymentStatus$.pipe(
      filter(status => status === "not paid"),
      map(() => ({ status: "not paid" as SurveyPaymentStatus['status'], models: [] as SurveyModel[] }))
    )

    this.surveyHandler$ = merge(paidSurvey$, notPaidSurvey$);
  }

}