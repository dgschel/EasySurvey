import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SurveyModel, SurveyName } from '../../../../util/type/survey-type';
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
  @ViewChild('container', { static: true, read: TemplateRef }) containerTemplate!: TemplateRef<any>;
  models: SurveyModel[] = [];

  form = new FormGroup({
    sections: new FormArray([])
  })
}
