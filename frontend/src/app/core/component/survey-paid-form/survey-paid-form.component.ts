import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, createComponent, ElementRef, EnvironmentInjector, HostListener, inject, input, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, delay, EMPTY, exhaustMap, fromEvent, map, Subscription, tap } from 'rxjs';

import { SurveyModel } from '../../../util/type/survey-type';
import { ViewSurveyGroupComponent } from "../../../shared/ui/view-survey-group/view-survey-group.component";
import { Submission } from '../../../util/type/submission';
import { HttpService } from '../../service/http.service';
import { environment } from '../../../../environments/environment';
import { ModalService } from '../../service/modal.service';
import { SurveyResetConfirmComponent } from '../../../shared/ui/template/modal/survey-reset-confirm/survey-reset-confirm.component';
import { GeneralMessageComponent } from "../../../shared/ui/general-message/general-message.component";

@Component({
  selector: 'app-survey-paid-form',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent, GeneralMessageComponent],
  templateUrl: './survey-paid-form.component.html',
  styleUrl: './survey-paid-form.component.scss'
})
export class SurveyPaidFormComponent implements AfterViewInit, AfterContentChecked, OnDestroy {
  private httpService = inject(HttpService);
  private changeDetector = inject(ChangeDetectorRef);
  private modalService = inject(ModalService);
  private environmentInjector = inject(EnvironmentInjector);

  // ViewChildren is used to query each ViewSurveyGroupComponent instance
  // This is useful for getting the form values from each survey group
  @ViewChildren(ViewSurveyGroupComponent) surveyGroups!: QueryList<ViewSurveyGroupComponent>

  @ViewChild('submitForm') submitForm!: ElementRef<HTMLFormElement>;

  surveyModels = input.required<SurveyModel[]>();
  surveyId = input.required<string>();

  submitFormSub: Subscription | undefined;
  form = new FormGroup({});
  formSubmitted: boolean = false;
  isFormSubmitting: boolean = false;
  /*
  * The start date when the component is initialized
  * Currently this will not reset when the form is submitted and the user wants to fill it again
  * although it should reset when the form is submitted and the user wants to fill it again to calculate the time taken to fill the form
  */
  startSurveyDate: Date = new Date();

  // Checks if the form is valid and has not been submitted
  get isValidAndNotSubmitted(): boolean {
    return this.form.valid && !this.isFormSubmitting;
  }

  ngAfterViewInit(): void {
    this.submitFormSub = fromEvent(this.submitForm.nativeElement, 'click').pipe(
      tap(() => {
        this.isFormSubmitting = true;
        this.formSubmitted = true;
      }),
      map(() => this.createSubmission("success")),
      exhaustMap(submission => this.httpService.post<undefined>(environment.endpoints.saveSubmission, submission)
        .pipe(
          delay(10000),
          catchError(error => {
            // TODO: Handle error by showing a message to the user that the submission failed using modal service
            console.error("Error submitting survey form:", error);
            return EMPTY; // Return an empty observable to prevent the error from propagating
          })
        )
      ),
      map(() => this.resetControls())
    ).subscribe();
  }

  ngAfterContentChecked(): void {
    // We need to manually trigger change detection to update the view when the form is updated using data binding
    // Since every survey group is a separate component that can have a form control which updates on blur, we need to manually trigger change detection to update the view
    this.changeDetector.detectChanges();
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

  private createSubmission(status: "success" | "failure") {
    const surveyFormData: Record<string, string | string[]> = this.createSurveyFormData();

    const submission: Submission = {
      submission: surveyFormData,
      surveyId: this.surveyId(),
      status,
      statistic: {
        startDate: this.startSurveyDate,
        endDate: new Date(),
        status
      }
    }

    return submission;
  }

  showResetDialog(): void {
    const cmp = createComponent(SurveyResetConfirmComponent, {
      environmentInjector: this.environmentInjector,
    });

    cmp.instance.reset.subscribe(() => {
      this.resetControls();
      this.modalService.close();
    })

    const modal = this.modalService.open(cmp);
    modal.instance.modalCloseEvent.subscribe(() => this.modalService.close());
  }

  private resetControls(): void {
    this.surveyGroups.forEach(group => group.resetFormControlComponent());
  }

  private sendSubmissionBeacon(submission: Submission) {
    // Send the submission data to the backend using the Beacon API
    // This is useful for sending data to the server even if the user navigates away or close the browser / tab
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon

    if (this.formSubmitted) return;

    const saveSubmissionUrl = `${environment.apiUrl}/${environment.endpoints.saveSubmission}`;
    navigator.sendBeacon(saveSubmissionUrl, JSON.stringify(submission));
  }

  // This method is called when the user tries to navigate away from the page either through the browser navigation or by closing the tab
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    const surveyFormData = this.createSubmission("failure");
    this.sendSubmissionBeacon(surveyFormData);
  }

  ngOnDestroy() {
    const surveyFormData = this.createSubmission("failure");
    this.sendSubmissionBeacon(surveyFormData);

    this.submitFormSub?.unsubscribe();
  }
}
