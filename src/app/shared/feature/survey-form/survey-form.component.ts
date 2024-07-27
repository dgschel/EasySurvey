import { Component, ComponentRef, inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';

import { SurveyDataStorageService } from '../../../core/service/survey-data-storage.service';
import { CreateSurveyGroupComponent } from '../create-survey-group/create-survey-group.component';
import { SurveyModelStorage, SurveyRefData } from '../../../util/type/survey-type';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [JsonPipe, CreateSurveyGroupComponent, AsyncPipe],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss'
})
export class SurveyFormComponent implements OnInit {
  private surveyStorage = inject(SurveyDataStorageService)
  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;
  cmpRefs: ComponentRef<CreateSurveyGroupComponent>[] = [];

  data$ = this.surveyStorage.getData$();

  ngOnInit(): void {
    this.data$.subscribe((surveyList) => {
      const surveyData = surveyList.map(survey => {
        return { ...survey, validator: survey.validator };
      })
      localStorage.setItem('surveyData', JSON.stringify(surveyData));
    })
  }

  addSection() {
    const cmpRef = this.componentContainer.createComponent(CreateSurveyGroupComponent);
    cmpRef.instance.remove.subscribe(() => this.removeSurveySection(cmpRef));
    cmpRef.instance.stateChanged.subscribe((state) => this.updateSectionData(cmpRef, state));
    this.surveyStorage.addData({ ref: cmpRef, data: { title: '', description: '', validator: {}, type: 'input' } });
    this.cmpRefs.push(cmpRef);
  }

  updateSectionData(cmpRef: ComponentRef<CreateSurveyGroupComponent>, state: SurveyModelStorage) {
    const surveyRefData: SurveyRefData = {
      ref: cmpRef,
      data: { ...state }
    }
    this.surveyStorage.updateData(cmpRef, surveyRefData);
  }

  removeSurveySection(cmpRef: ComponentRef<CreateSurveyGroupComponent>) {
    const index = this.cmpRefs.indexOf(cmpRef);
    if (index !== -1) {
      this.surveyStorage.removeData(cmpRef);
      this.cmpRefs.splice(index, 1);
      cmpRef.destroy();
    }
  }

  clearData() {
    this.surveyStorage.clearData();
  }

  ngOnDestroy() {
    this.cmpRefs.forEach((comp) => comp.destroy());
    this.cmpRefs = [];
  }
}
