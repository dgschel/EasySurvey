import { ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ViewSurveyGroupComponent } from '../shared/ui/view-survey-group/view-survey-group.component';
import { BasicCardComponent } from "../shared/ui/basic-card/basic-card.component";
import { SurveyModel } from '../util/type/survey-type';
import { AzureSurveyService } from '../core/service/azure-survey.service';
import { Submission } from '../util/type/submission';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-view-survey-form',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent, BasicCardComponent],
  templateUrl: './view-survey-form.component.html',
  styleUrl: './view-survey-form.component.scss',
})
export class ViewSurveyFormComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private azureSurveyService = inject(AzureSurveyService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // ViewChildren is used to query each ViewSurveyGroupComponent instance
  // This is useful for getting the form values from each survey group
  @ViewChildren(ViewSurveyGroupComponent) surveyGroups!: QueryList<ViewSurveyGroupComponent>

  models: SurveyModel[] = [];
  form = new FormGroup({});
  surveyId: string = "";

  startSurveyDate: Date = new Date();

  ngOnInit(): void {
    const surveyId = this.activatedRoute.snapshot.paramMap.get('id');

    if (!surveyId || surveyId === '') {
      this.router.navigate(['/home']);
      return;
    }

    this.surveyId = surveyId;

    this.azureSurveyService.fetchSurveyData(surveyId).subscribe({
      next: (response) => {
        this.models = response.data
        this.cdr.detectChanges();
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
    navigator.sendBeacon(environment.endpoints.saveSubmission, JSON.stringify(submission));
  }

  private createSubmission(status: "success" | "failure") {
    const surveyFormData: Record<string, string | string[]> = this.createSurveyFormData();

    const submission: Submission = {
      surveyFormData: surveyFormData,
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

    this.azureSurveyService.saveSurveySubmission(submission).subscribe({
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
    this.sendSubmissionBeacon(surveyFormData);
  }

  // This method is called when the component is destroyed
  ngOnDestroy() {
    const surveyFormData = this.createSubmission("failure");
    this.sendSubmissionBeacon(surveyFormData);
  }
}