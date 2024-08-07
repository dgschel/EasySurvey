import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentRef, inject, Input, ViewChild, ViewContainerRef } from '@angular/core';

import { CreateSurveyGroupComponent } from '../create-survey-group/create-survey-group.component';
import { SurveyModel } from '../../../util/type/survey-type';
import { AzureSurveyService } from '../../../core/service/azure-survey.service';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CreateSurveyGroupComponent],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyFormComponent implements AfterViewInit {
  private azureSurveyService = inject(AzureSurveyService)

  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;
  @Input() models: SurveyModel[] = [];

  cmpRefs: ComponentRef<CreateSurveyGroupComponent>[] = [];

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
    cmpRef.setInput('model', model);
    this.cmpRefs.push(cmpRef);
  }

  save() {
    const models = this.cmpRefs.map((cmpRef) => cmpRef.instance.surveyModel())
    this.azureSurveyService.saveSurveyData(models).subscribe(data => console.log("Data saved", data));
  }

  setupComponent(cmpRef: ComponentRef<CreateSurveyGroupComponent>) {
    cmpRef.instance.remove.subscribe(() => this.removeSurveySection(cmpRef));
  }

  removeSurveySection(cmpRef: ComponentRef<CreateSurveyGroupComponent>) {
    const index = this.cmpRefs.indexOf(cmpRef);
    if (index !== -1) {
      this.cmpRefs.splice(index, 1);
      cmpRef.destroy();
    }
  }

  ngOnDestroy() {
    this.cmpRefs.forEach((comp) => comp.destroy());
    this.cmpRefs = [];
  }
}
