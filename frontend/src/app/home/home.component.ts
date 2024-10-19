import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SurveyTemplateManager } from '../core/model/survey-template-manager';
import { SurveyFormComponent } from '../shared/feature/survey-form/survey-form.component';
import { SurveyModel } from '../util/type/survey-type';
import { DisplayAccordionComponent } from '../shared/ui/display-accordion/display-accordion.component';
import { FaqComponent } from "./components/faq/faq.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SurveyFormComponent, DisplayAccordionComponent, FaqComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  surveyManager = inject(SurveyTemplateManager);
  route = inject(ActivatedRoute);

  models: SurveyModel[] = [];

  ngOnInit() {
    const surveyTemplate = this.route.snapshot.paramMap.get('template');
    const survey = this.surveyManager.surveyTemplateModels.find(
      (model) => model.name.toLowerCase() === surveyTemplate,
    );

    if (survey) {
      this.models = survey.models;
    }
  }
}
