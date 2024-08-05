import { AfterViewInit, Component, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SurveyModel, SurveyName } from '../../../../util/type/survey-type';
import { ViewSurveyGroupComponent } from '../../view-survey-group/view-survey-group.component';
import { SurveyTemplateManager } from '../../../../core/model/survey-template-manager';

@Component({
  selector: 'app-preview-survey',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent],
  templateUrl: './preview-survey.component.html',
  styleUrl: './preview-survey.component.scss'
})
export class PreviewSurveyComponent implements AfterViewInit {
  surveyTemplateManager = inject(SurveyTemplateManager);
  @Input() surveyName: SurveyName = 'Standard';
  @ViewChild('container', { static: true, read: TemplateRef }) containerTemplate!: TemplateRef<any>;
  models: SurveyModel[] = [];

  form = new FormGroup({
    sections: new FormArray([])
  })

  ngAfterViewInit(): void {
    const survey = this.surveyTemplateManager.getSurvey(this.surveyName);
    this.models = survey.createPredefinedSurvey();
  }
}
