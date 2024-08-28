import { ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ViewSurveyGroupComponent } from '../shared/ui/view-survey-group/view-survey-group.component';
import { BasicCardComponent } from "../shared/ui/basic-card/basic-card.component";
import { SurveyModel } from '../util/type/survey-type';
import { AzureSurveyService } from '../core/service/azure-survey.service';
import { Submission } from '../util/type/submission';

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

  // This method is called when the user tries to navigate away from the page either through the browser navigation or by closing the tab
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    // TODO: Add logic to add to submission statistics that this was failed
    event.preventDefault();
  }

  ngOnDestroy() {
    // TODO: Add logic to add to submission statistics that this was failed
  }

  submit() {
    // We could use this.form.value to get the form values but the checkboxes are only returning true or false
    // So we need to get the values from the components that holds the form values instead
    const surveyFormData: Record<string, string | string[]> = this.surveyGroups.reduce((acc, group) => {
      return {
        ...acc,
        [group.model.title]: group.getFormControlComponentValue()
      }
    }, {});

    const submission: Submission = {
      surveyFormData: surveyFormData,
      surveyId: this.surveyId,
      statistic: {
        startDate: this.startSurveyDate,
        endDate: new Date(),
        status: "success"
      }
    }

    this.azureSurveyService.saveSurveySubmission(submission).subscribe({
      next: (response) => {
        console.log("Response", response);
      },
      error(err) {
        console.log("Error", err);
      },
    })
  }
}