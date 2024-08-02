import { Component, ComponentRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';

import { ViewSurveyGroupComponent } from '../shared/ui/view-survey-group/view-survey-group.component';
import { SurveyTemplateManager } from '../core/model/survey-template-manager';
import { ModalService } from '../core/service/modal.service';
import { ModalComponent } from '../core/component/modal/modal.component';
import { PreviewSurveyComponent } from '../shared/ui/template/preview-survey/preview-survey.component';
import { SurveyName } from '../util/type/survey-type';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [ReactiveFormsModule, ViewSurveyGroupComponent, KeyValuePipe],
  templateUrl: './store-form.component.html',
  styleUrl: './store-form.component.scss'
})
export class StoreFormComponent {
  modalService = inject(ModalService);
  environmentInjector = inject(EnvironmentInjector);
  surveyManager = inject(SurveyTemplateManager);
  modalRef!: ComponentRef<ModalComponent>;

  preview(surveyName: string) {
    const cmp = createComponent(PreviewSurveyComponent, {
      environmentInjector: this.environmentInjector,
    })

    cmp.setInput('surveyName', surveyName as SurveyName);

    const modalRef = this.modalService.open(cmp);
  }
}