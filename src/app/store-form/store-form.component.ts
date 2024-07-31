import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';

import { ViewSurveyGroupComponent } from '../shared/ui/view-survey-group/view-survey-group.component';
import { BasicSurveyTemplate } from '../core/templates/basic-survey-template';
import { PurchaseSurveyTemplate } from '../core/templates/purchase-survey-template';
import { SurveyTemplateManager } from '../core/model/survey-template-manager';
import { ModalService } from '../core/service/modal.service';
import { SurveyModel, SurveyName } from '../util/type/survey-type';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent, KeyValuePipe],
  templateUrl: './store-form.component.html',
  styleUrl: './store-form.component.scss'
})
export class StoreFormComponent {
  modalService = inject(ModalService);
  surveyManager: SurveyTemplateManager;
  models: SurveyModel[] = [];

  // Use form to display the survey that is created by the user and inserted into the modal
  // The form is not used to submit the survey, it is only used to display the survey
  // We need this here so that the component, which is reponsible to create the survey based on the array of models, can be used in the template
  form = new FormGroup({
    sections: new FormArray([])
  })

  @ViewChild('container') container!: TemplateRef<any>;

  constructor() {
    const basicSurvey = new BasicSurveyTemplate();
    const purchaseSurvey = new PurchaseSurveyTemplate();

    this.surveyManager = new SurveyTemplateManager();
    this.surveyManager.addSurvey('Standard', basicSurvey);
    this.surveyManager.addSurvey('Einkaufsformular', purchaseSurvey);
  }

  preview(surveyName: string) {
    const survey = this.surveyManager.getSurvey(surveyName as SurveyName);
    this.models = survey.createPredefinedSurvey()
    this.modalService.open(this.container);
  }
}