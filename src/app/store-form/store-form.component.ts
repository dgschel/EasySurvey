import { AfterViewInit, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ViewSurveyGroupComponent } from '../shared/ui/view-survey-group/view-survey-group.component';
import { BasicSurveyTemplate } from '../core/templates/basic-survey-template';
import { PurchaseSurveyTemplate } from '../core/templates/purchase-survey-template';
import { SurveyTemplateManager } from '../core/model/survey-template-manager';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent],
  templateUrl: './store-form.component.html',
  styleUrl: './store-form.component.scss'
})
export class StoreFormComponent {
  surveyManager: SurveyTemplateManager;
  surveyNames: string[] = [];
  survey: Record<string, number> = {};
  total: number = 0;

  constructor() {
    const basicSurvey = new BasicSurveyTemplate();
    const purchaseSurvey = new PurchaseSurveyTemplate();

    this.surveyManager = new SurveyTemplateManager();
    this.surveyManager.addSurvey('basic', basicSurvey);
    this.surveyManager.addSurvey('purchase', purchaseSurvey);
    this.surveyNames = this.surveyManager.surveyNames;
    this.survey = this.surveyManager.countControlsBySurvey;
  }
}


