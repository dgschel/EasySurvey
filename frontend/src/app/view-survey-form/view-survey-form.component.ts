import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ViewSurveyGroupComponent } from '../shared/ui/view-survey-group/view-survey-group.component';
import { BasicCardComponent } from "../shared/ui/basic-card/basic-card.component";
import { SurveyModel } from '../util/type/survey-type';
import { AzureSurveyService } from '../core/service/azure-survey.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-survey-form',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent, BasicCardComponent],
  templateUrl: './view-survey-form.component.html',
  styleUrl: './view-survey-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewSurveyFormComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private azureSurveyService = inject(AzureSurveyService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  models: SurveyModel[] = [];

  form = new FormGroup({
    sections: new FormArray([])
  })

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
}