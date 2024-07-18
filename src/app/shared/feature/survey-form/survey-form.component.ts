import { Component, ComponentRef, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';

import { SurveyDataStorageService } from '../../../core/service/survey-data-storage.service';
import { CreateSurveyGroupComponent } from '../create-survey-group/create-survey-group.component';
import { SurveyRefData } from '../../../util/type/survey-type';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [JsonPipe, CreateSurveyGroupComponent, AsyncPipe],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss'
})
export class SurveyFormComponent {
  private surveyStorage = inject(SurveyDataStorageService)
  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;
  cmpRefs: ComponentRef<CreateSurveyGroupComponent>[] = [];

  data$ = this.surveyStorage.getData$();

  addSection() {
    const cmpRef = this.componentContainer.createComponent(CreateSurveyGroupComponent);
    cmpRef.instance.remove.subscribe(() => {
      this.removeSurveySection(cmpRef)
      this.surveyStorage.removeData(cmpRef);
    });

    cmpRef.instance.stateChanged.subscribe((state) => {
      const obj: SurveyRefData = {
        ref: cmpRef,
        data: {
          title: state.title,
          description: state.description
        }
      }

      this.surveyStorage.updateData(cmpRef, obj);
    });

    this.surveyStorage.addData({
      ref: cmpRef,
      data: {
        title: '',
        description: ''
      }
    });

    this.cmpRefs.push(cmpRef);
  }

  removeSurveySection(cmpRef: ComponentRef<CreateSurveyGroupComponent>) {
    const index = this.cmpRefs.indexOf(cmpRef);
    if (index !== -1) {
      this.cmpRefs.splice(index, 1);
      cmpRef.destroy();
    }
  }

  ngOnDestroy() {
    this.cmpRefs.forEach((comp) => {
      this.removeSurveySection(comp);
      this.surveyStorage.clearData();
    });
  }
}
