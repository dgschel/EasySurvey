import { AfterViewInit, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SurveyModel } from '../util/type/survey-type';
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
export class StoreFormComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  surveyManager: SurveyTemplateManager;

  surveyModels: { name: string, models: SurveyModel[] }[] = [];

  fb = inject(FormBuilder);
  form = this.fb.group({
    sections: this.fb.array([])
  });

  constructor() {
    const basicSurvey = new BasicSurveyTemplate();
    const purchaseSurvey = new PurchaseSurveyTemplate();

    this.surveyManager = new SurveyTemplateManager();
    this.surveyManager.addSurvey('basic', basicSurvey);
    this.surveyManager.addSurvey('purchase', purchaseSurvey);
  }

  ngAfterViewInit(): void {
    this.surveyModels = this.surveyManager.surveyModels;
    this.cdr.detectChanges();
  }
}


