import { ChangeDetectorRef, Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
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
export class ViewSurveyFormComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private azureSurveyService = inject(AzureSurveyService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // ViewChildren is used to query each ViewSurveyGroupComponent instance
  // This is useful for getting the form values from each survey group
  @ViewChildren(ViewSurveyGroupComponent) surveyGroups!: QueryList<ViewSurveyGroupComponent>

  models: SurveyModel[] = [];
  form = new FormGroup({});
  id: string = "";

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (!id || id === '') {
      this.router.navigate(['/home']);
      return;
    }

    this.id = id;

    this.azureSurveyService.fetchSurveyData(id).subscribe({
      next: (response) => {
        this.models = response.data
        this.cdr.detectChanges();
      },
      error(err) {
        console.log("Error", err);
      },
    })
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
      surveyId: this.id,
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