import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ViewSurveyGroupComponent } from '../../../../shared/ui/view-survey-group/view-survey-group.component';
import { SurveyModel } from '../../../../util/type/survey-type';

@Component({
  selector: 'app-survey-preview',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent],
  templateUrl: './survey-preview.component.html',
  styleUrl: './survey-preview.component.scss',
})
export class SurveyPreviewComponent {
  models = input.required<SurveyModel[]>();
  form = new FormGroup({});
}
