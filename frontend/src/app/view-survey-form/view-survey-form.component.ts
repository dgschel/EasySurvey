import { ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';

import { catchError, EMPTY, filter, map, merge, Observable, of, shareReplay, switchMap } from 'rxjs';

import { ViewSurveyGroupComponent } from '../shared/ui/view-survey-group/view-survey-group.component';
import { BasicCardComponent } from "../shared/ui/basic-card/basic-card.component";
import { SurveyModel, SurveyPaymentStatus } from '../util/type/survey-type';
import { Submission } from '../util/type/submission';
import { environment } from '../../environments/environment';
import { HttpService } from '../core/service/http.service';
import { GeneralErrorMessageComponent } from "../shared/ui/general-error-message/general-error-message.component";

@Component({
  selector: 'app-view-survey-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ViewSurveyGroupComponent,
    BasicCardComponent,
    AsyncPipe,
    JsonPipe,
    GeneralErrorMessageComponent,
    RouterLink
  ],
  templateUrl: './view-survey-form.component.html',
  styleUrl: './view-survey-form.component.scss',
})
export class ViewSurveyFormComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private httpService = inject(HttpService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  surveyHandler$: Observable<SurveyModel[]> = EMPTY;

  // ViewChildren is used to query each ViewSurveyGroupComponent instance
  // This is useful for getting the form values from each survey group
  @ViewChildren(ViewSurveyGroupComponent) surveyGroups!: QueryList<ViewSurveyGroupComponent>

  models: SurveyModel[] = [];
  form = new FormGroup({});
  surveyId: string = "";
  formSubmitted: boolean = false;
  startSurveyDate: Date = new Date();

  ngOnInit(): void {
    const surveyId$ = this.activatedRoute.paramMap.pipe(
      map(params => params.get('id') || ''),
    )

    const surveyPaymentStatus$ = surveyId$.pipe(
      map(surveyId => environment.endpoints.surveyPaymentStatus.replace('{surveyId}', surveyId)),
      switchMap(url => this.httpService.get<SurveyPaymentStatus>(url)
        .pipe(
          catchError(() => {
            // TODO: Handle error
            console.log("Error fetching survey payment status");
            return EMPTY; // Return an empty observable
          })
        )),
      map(({ data }) => data.status),
      shareReplay(1) // Ensure that only one request is made to the server for the payment status when multiple subscribers are present
    )

    const paidSurvey$ = surveyPaymentStatus$.pipe(
      filter(status => status === "paid"),
      switchMap(() => this.httpService.get<SurveyModel[]>(environment.endpoints.readSurvey, { id: this.surveyId })
        .pipe(
          catchError(() => {
            // TODO: Handle error
            console.log("Error fetching survey data");
            return EMPTY;
          })
        )
      ),
      map(({ data }) => data)
    )

    const notPaidSurvey$ = surveyPaymentStatus$.pipe(
      filter(status => status === "not paid"),
      switchMap(() => of([] as SurveyModel[]))
    )

    this.surveyHandler$ = merge(paidSurvey$, notPaidSurvey$);
  }

  private sendSubmissionBeacon(submission: Submission) {
    // Send the submission data to the backend using the Beacon API
    // This is useful for sending data to the server even if the user navigates away or close the browser / tab
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon

    if (this.formSubmitted) return;

    const saveSubmissionUrl = `${environment.apiUrl}/${environment.endpoints.saveSubmission}`;
    navigator.sendBeacon(saveSubmissionUrl, JSON.stringify(submission));
  }

  private createSubmission(status: "success" | "failure") {
    const surveyFormData: Record<string, string | string[]> = this.createSurveyFormData();

    const submission: Submission = {
      submission: surveyFormData,
      surveyId: this.surveyId,
      status,
      statistic: {
        startDate: this.startSurveyDate,
        endDate: new Date(),
        status
      }
    }

    return submission;
  }

  // Creates a survey form data object from the survey groups
  private createSurveyFormData(): Record<string, string | string[]> {
    return this.surveyGroups.reduce((acc, group) => {
      return {
        ...acc,
        [group.model.title]: group.getFormControlComponentValue()
      };
    }, {});
  }

  submit(): void {
    const submission = this.createSubmission("success");

    // dont allow multiple submissions
    // example scenario: user clicks submit and then leaves the page or destroys the window. then a success and failure submit will be sent
    this.formSubmitted = true;

    this.httpService.post(environment.endpoints.saveSubmission, submission).subscribe({
      next: (response) => {
        console.log("Response", response);
      },
      error(err) {
        console.log("Error", err);
      },
    })
  }

  // This method is called when the user tries to navigate away from the page either through the browser navigation or by closing the tab
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    const surveyFormData = this.createSubmission("failure");
    // this.sendSubmissionBeacon(surveyFormData);
  }

  // This method is called when the component is destroyed
  ngOnDestroy() {
    const surveyFormData = this.createSubmission("failure");
    this.sendSubmissionBeacon(surveyFormData);
  }
}