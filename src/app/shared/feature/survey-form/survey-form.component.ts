import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';

import { SurveyDataStorageService } from '../../../core/service/survey-data-storage.service';
import { CreateSurveyGroupComponent } from '../create-survey-group/create-survey-group.component';
import { SurveyModel, SurveyRefData } from '../../../util/type/survey-type';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [JsonPipe, CreateSurveyGroupComponent, AsyncPipe],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss'
})
export class SurveyFormComponent implements OnInit, AfterViewInit {
  private surveyStorage = inject(SurveyDataStorageService)
  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;
  @Input() models: SurveyModel[] = [];
  cmpRefs: ComponentRef<CreateSurveyGroupComponent>[] = [];

  cdr = inject(ChangeDetectorRef)

  data$ = this.surveyStorage.getData$();

  ngOnInit(): void {
    this.data$.subscribe((models) => {
      localStorage.setItem('surveyData', JSON.stringify(models));
    })
  }

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
    this.surveyStorage.addData({ ref: cmpRef, data: model });
    this.cmpRefs.push(cmpRef);
    this.detectChanges();
  }

  setupComponent(cmpRef: ComponentRef<CreateSurveyGroupComponent>) {
    cmpRef.instance.remove.subscribe(() => this.removeSurveySection(cmpRef));
    cmpRef.instance.stateChanged.subscribe((state) => this.updateSectionData(cmpRef, state));
    cmpRef.changeDetectorRef.detectChanges();
  }

  detectChanges() {
    this.cdr.detectChanges();
  }

  updateSectionData(cmpRef: ComponentRef<CreateSurveyGroupComponent>, state: SurveyModel) {
    const surveyRefData: SurveyRefData = {
      ref: cmpRef,
      data: state
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
