import { ChangeDetectorRef, Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ViewSurveyGroupComponent } from '../shared/ui/view-survey-group/view-survey-group.component';
import { BasicCardComponent } from "../shared/ui/basic-card/basic-card.component";
import { SurveyModel } from '../util/type/survey-type';
import { AzureSurveyService } from '../core/service/azure-survey.service';

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

  @ViewChildren(ViewSurveyGroupComponent) surveyGroups!: QueryList<ViewSurveyGroupComponent>

  models: SurveyModel[] = [];

  form = new FormGroup({})

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (!id || id === '') {
      this.router.navigate(['/home']);
      return;
    }

    this.azureSurveyService.fetchSurveyData(id).subscribe({
      next: (response: { message: string, data: SurveyModel[] }) => {
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
    // So we need to get the values from the surveyGroups instead

    const survey = this.surveyGroups.reduce((acc, group) => {
      return {
        ...acc,
        [group.model.title]: group.getFormControlComponentValue()
      }
    }, {})

    console.log(survey);
  }
}