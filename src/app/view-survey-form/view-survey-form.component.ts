import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { SurveyDataService } from '../core/service/survey-data.service';
import { ViewSurveyGroupComponent } from '../shared/ui/view-survey-group/view-survey-group.component';
import { BasicCardComponent } from "../shared/ui/basic-card/basic-card.component";
import { SurveyModel } from '../util/type/survey-type';

@Component({
  selector: 'app-view-survey-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, ViewSurveyGroupComponent, BasicCardComponent],
  templateUrl: './view-survey-form.component.html',
  styleUrl: './view-survey-form.component.scss'
})
export class ViewSurveyFormComponent implements OnInit {
  private surveyDataService = inject(SurveyDataService);
  private cdr = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);

  surveyComponents: SurveyModel[] = [];

  form = this.fb.group({
    sections: this.fb.array([])
  });

  ngOnInit(): void {
    this.surveyComponents = this.surveyDataService.getSurveyData()
    this.cdr.detectChanges();
  }
}