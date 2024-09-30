import { AfterViewInit, ChangeDetectionStrategy, EnvironmentInjector, Component, ComponentRef, inject, Input, ViewChild, ViewContainerRef, createComponent } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

import { SvgIconComponent } from 'angular-svg-icon';

import { CreateSurveyGroupComponent } from '../create-survey-group/create-survey-group.component';
import { SurveyModel, SurveyRadioModel } from '../../../util/type/survey-type';
import { HttpService } from '../../../core/service/http.service';
import { environment } from '../../../../environments/environment';
import { ModalService } from '../../../core/service/modal.service';
import { SurveySuccessfullySavedComponent } from '../../ui/template/modal/survey-successfully-saved/survey-successfully-saved.component';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CreateSurveyGroupComponent, CdkDropList, SvgIconComponent],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyFormComponent implements AfterViewInit {
  private httpService = inject(HttpService)
  private modalService = inject(ModalService)
  private environmentInjector = inject(EnvironmentInjector);

  @ViewChild('component', { read: ViewContainerRef }) componentContainer!: ViewContainerRef;
  @Input() models: SurveyModel[] = [];

  cmpRefs: ComponentRef<CreateSurveyGroupComponent>[] = [];

  ngAfterViewInit(): void {
    this.models.forEach((model) => {
      this.addSurveySection(model);
    });
  }

  /**
   * Handles the drop event for the survey form component.
   *
   * @param event - The drop event containing information about the dragged item.
   */
  drop(event: CdkDragDrop<ComponentRef<CreateSurveyGroupComponent>[]>) {
    // Move the items with the helper function from the drag-drop module
    moveItemInArray(this.cmpRefs, event.previousIndex, event.currentIndex);

    // Update the view to reflect the new order
    this.updateView();
  }

  updateView() {
    this.cmpRefs.forEach(componentRef => {
      this.componentContainer.insert(componentRef.hostView);
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
    const surveyModels = this.cmpRefs.map((cmpRef) => cmpRef.instance.surveyModel())

    if (surveyModels.length === 0) return;

    // Get a *reference* of the radio models and iterate over their names
    const radioModels = surveyModels.filter((model) => model.type === 'radio') as SurveyRadioModel[];
    this.generateRadioNames(radioModels);

    const surveyId$ = this.httpService.post<{ surveyId: string }>(environment.endpoints.saveSurvey, surveyModels);


    surveyId$.subscribe(({ data }) => {
      const cmp = createComponent(SurveySuccessfullySavedComponent, {
        environmentInjector: this.environmentInjector,
      });

      cmp.setInput('surveyId', data.surveyId);

      const modal = this.modalService.open(cmp);
      modal.setInput('isBackdropClosable', false);
      modal.instance.modalCloseEvent.subscribe(() => this.modalService.close());
    });
  }

  generateRadioNames(models: SurveyRadioModel[]) {
    models.forEach((model, index) => {
      model.name = `radio-${index + 1}`;
    });
  }

  setupComponent(cmpRef: ComponentRef<CreateSurveyGroupComponent>) {
    cmpRef.instance.clonedSurvey.subscribe((model) => this.insertComponentBeneath(cmpRef, model));
    cmpRef.instance.remove.subscribe(() => this.removeSurveySection(cmpRef));
  }

  insertComponentBeneath(originalCmpRef: ComponentRef<CreateSurveyGroupComponent>, model: SurveyModel) {
    const originalCmpIndex = this.cmpRefs.indexOf(originalCmpRef);

    // Create a new component beneath the original component
    const clonedCmpRef = this.componentContainer.createComponent(CreateSurveyGroupComponent, {
      index: originalCmpIndex + 1
    });

    this.setupComponent(clonedCmpRef);
    clonedCmpRef.setInput('model', model);
    this.cmpRefs.splice(originalCmpIndex + 1, 0, clonedCmpRef);
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

    this.modalService.close();
  }
}
