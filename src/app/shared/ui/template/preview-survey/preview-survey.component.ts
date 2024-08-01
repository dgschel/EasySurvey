import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SurveyName } from '../../../../util/type/survey-type';
import { ViewSurveyGroupComponent } from '../../view-survey-group/view-survey-group.component';

@Component({
  selector: 'app-preview-survey',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent],
  templateUrl: './preview-survey.component.html',
  styleUrl: './preview-survey.component.scss'
})
export class PreviewSurveyComponent {
  @Input() surveyName: SurveyName = 'Standard';
}
