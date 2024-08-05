import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, inject, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';

import { SurveyDataStorageService } from '../../../core/service/survey-data-storage.service';
import { CreateSurveyGroupComponent } from '../create-survey-group/create-survey-group.component';
import { SurveyModel } from '../../../util/type/survey-type';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [JsonPipe, CreateSurveyGroupComponent, AsyncPipe],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyFormComponent implements AfterViewInit {
  private surveyStorage = inject(SurveyDataStorageService)
  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;
  @Input() models: SurveyModel[] = [];
  cmpRefs: ComponentRef<CreateSurveyGroupComponent>[] = [];

  cdr = inject(ChangeDetectorRef)

  data$ = this.surveyStorage.getData$();

  ngAfterViewInit(): void {
    this.models.forEach((model) => {
      this.addSurveySection(model);
    });
  }

  addSection() {
    this.addSurveySection({ type: 'input', description: '', title: '', validator: {} });
  }

  addSurveySection(model: SurveyModel) {
    const cmpRef = this.componentContainer.createComponent(CreateSurveyGroupComponent);
    this.setupComponent(cmpRef);
    cmpRef.setInput('model', model)
    this.surveyStorage.addData({ ref: cmpRef, data: model });
    this.cmpRefs.push(cmpRef);
  }

  save() {
    const models = this.cmpRefs.map((cmpRef) => cmpRef.instance.surveyModel())
    localStorage.setItem('surveyData', JSON.stringify(models));
    this.surveyStorage.clearData();
  }

  setupComponent(cmpRef: ComponentRef<CreateSurveyGroupComponent>) {
    cmpRef.instance.remove.subscribe(() => this.removeSurveySection(cmpRef));
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
