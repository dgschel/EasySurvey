import { AfterContentChecked, ChangeDetectorRef, Component, HostListener, inject, input, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SurveyModel } from '../../../util/type/survey-type';
import { ViewSurveyGroupComponent } from "../../../shared/ui/view-survey-group/view-survey-group.component";
import { Submission } from '../../../util/type/submission';
import { HttpService } from '../../service/http.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-survey-paid-form',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent],
  templateUrl: './survey-paid-form.component.html',
  styleUrl: './survey-paid-form.component.scss'
})
export class SurveyPaidFormComponent implements AfterContentChecked, OnDestroy {
  private httpService = inject(HttpService);
  private changeDetector = inject(ChangeDetectorRef);

  surveyModels = input.required<SurveyModel[]>();
  surveyId = input.required<string>();

  form = new FormGroup({});
  formSubmitted: boolean = false;
  startSurveyDate: Date = new Date();

  ngAfterContentChecked(): void {
    // We need to manually trigger change detection to update the view when the form is updated using data binding
    // Since every survey group is a separate component that can have a form control which updates on blur, we need to manually trigger change detection to update the view
    this.changeDetector.detectChanges();
  }

  // ViewChildren is used to query each ViewSurveyGroupComponent instance
  // This is useful for getting the form values from each survey group
  @ViewChildren(ViewSurveyGroupComponent) surveyGroups!: QueryList<ViewSurveyGroupComponent>

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

  resetControls(): void {
    this.surveyGroups.forEach(group => group.resetFormControlComponent());
  }

  submit(): void {
    const submission = this.createSubmission("success");

    // TODO: Try to use rxJs to handle the submission. Maybe the operator 'exhaustMap' can be useful here and disable button while submitting

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


  private sendSubmissionBeacon(submission: Submission) {
    // Send the submission data to the backend using the Beacon API
    // This is useful for sending data to the server even if the user navigates away or close the browser / tab
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon

    if (this.formSubmitted) return;

    const saveSubmissionUrl = `${environment.apiUrl}/${environment.endpoints.saveSubmission}`;
    navigator.sendBeacon(saveSubmissionUrl, JSON.stringify(submission));
  }

  // TODO: Only allow a failure submission if the survey has been paid. Perhaps its fixed when we define a new component to only show when survey is paid. Move logic inside this component


  // This method is called when the user tries to navigate away from the page either through the browser navigation or by closing the tab
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    const surveyFormData = this.createSubmission("failure");
    this.sendSubmissionBeacon(surveyFormData);
  }

  // This method is called when the component is destroyed
  ngOnDestroy() {
    const surveyFormData = this.createSubmission("failure");
    this.sendSubmissionBeacon(surveyFormData);
  }
}
