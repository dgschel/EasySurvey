import { Component, ComponentRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ViewSurveyGroupComponent } from '../shared/ui/view-survey-group/view-survey-group.component';
import { SurveyTemplateManager } from '../core/model/survey-template-manager';
import { ModalService } from '../core/service/modal.service';
import { PreviewSurveyComponent } from '../shared/ui/template/modal/preview-survey/preview-survey.component';
import { SurveyName } from '../util/type/survey-type';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent, KeyValuePipe, LowerCasePipe, RouterLink],
  templateUrl: './store-form.component.html',
  styleUrl: './store-form.component.scss'
})
export class StoreFormComponent {
  modalService = inject(ModalService);
  environmentInjector = inject(EnvironmentInjector);
  surveyManager = inject(SurveyTemplateManager);
  
  preview(surveyName: string) {
    const cmp = createComponent(PreviewSurveyComponent, {
      environmentInjector: this.environmentInjector,
    })

    cmp.setInput('surveyName', surveyName as SurveyName);

    const modalRef = this.modalService.open(cmp);
    modalRef.instance.modalCloseEvent.subscribe(() => this.modalService.close());
  }
}