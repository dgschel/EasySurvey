import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SurveyTemplateManager } from '../core/model/survey-template-manager';
import { SurveyFormComponent } from '../shared/feature/survey-form/survey-form.component';
import { SurveyModel } from '../util/type/survey-type';
import {
  AccordionItem,
  DisplayAccordionComponent,
} from '../shared/ui/display-accordion/display-accordion.component';
import { FaqService } from '../core/service/faq.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SurveyFormComponent, DisplayAccordionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  surveyManager = inject(SurveyTemplateManager);
  route = inject(ActivatedRoute);
  faqService = inject(FaqService);

  models: SurveyModel[] = [];
  faqs: AccordionItem[] = [];

  ngOnInit() {
    this.faqService.getFaqData().subscribe((data) => (this.faqs = data));
    
    const surveyTemplate = this.route.snapshot.paramMap.get('template');
    const survey = this.surveyManager.surveyTemplateModels.find(
      (model) => model.name.toLowerCase() === surveyTemplate,
    );

    if (survey) {
      this.models = survey.models;
    }
  }
}
