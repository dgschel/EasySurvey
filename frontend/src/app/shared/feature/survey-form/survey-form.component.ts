import {
  AfterViewInit,
  ChangeDetectionStrategy,
  EnvironmentInjector,
  Component,
  ComponentRef,
  inject,
  Input,
  ViewChild,
  ViewContainerRef,
  createComponent,
  ElementRef,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { SvgIconComponent } from 'angular-svg-icon';
import {
  catchError,
  filter,
  fromEvent,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { CreateSurveyGroupComponent } from '../create-survey-group/create-survey-group.component';
import { SurveyModel, SurveyRadioModel } from '../../../util/type/survey-type';
import { HttpService } from '../../../core/service/http.service';
import { environment } from '../../../../environments/environment';
import { ModalService } from '../../../core/service/modal.service';
import { SurveySuccessfullySavedComponent } from '../../ui/template/modal/survey-successfully-saved/survey-successfully-saved.component';
import { HttpWrapper } from '../../../util/type/http';
import { isValidResponseGuard } from '../../../util/guard/http';
import { SurveyCreationFailedComponent } from '../../ui/template/modal/survey-creation-failed/survey-creation-failed.component';

@Component({
  selector: 'app-survey-form',
  standalone: true,
  imports: [CreateSurveyGroupComponent, CdkDropList, SvgIconComponent],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyFormComponent implements AfterViewInit {
  private httpService = inject(HttpService);
  private modalService = inject(ModalService);
  private environmentInjector = inject(EnvironmentInjector);

  @ViewChild('component', { read: ViewContainerRef })
  componentContainer!: ViewContainerRef;
  @ViewChild('addSection') addSectionBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('save') saveBtn!: ElementRef<HTMLButtonElement>;
  @Input() models: SurveyModel[] = [];

  cmpRefs: ComponentRef<CreateSurveyGroupComponent>[] = [];

  // Subject to destroy the subscriptions
  private readonly destroy$ = new Subject<void>();

  get hasComponents() {
    return this.cmpRefs.length;
  }

  ngAfterViewInit(): void {
    this.handleClickAddSection();
    this.handleSaveButtonClick();

    this.initializeSurveySections();
  }

  initializeSurveySections() {
    // If no models are provided, add a default survey section
    this.models.length === 0
      ? this.addSurveySection({
          type: 'input',
          description: '',
          title: '',
          validator: {},
        })
      : this.models.forEach((model) => this.addSurveySection(model));
  }

  handleSaveButtonClick(): void {
    fromEvent(this.saveBtn.nativeElement, 'click')
      .pipe(
        switchMap(() => this.getSurveyModels()),
        tap((models) => {
          // Get a *reference* of the radio models and iterate over their names
          const radioModels = this.getRadioModels(models);
          this.generateRadioNames(radioModels);
        }),
        switchMap((models) =>
          this.postSurveyModels(models).pipe(
            catchError((error) => {
              console.error('Error saving survey', error);
              this.openFailureModal();
              return of(null); // Return a null observable to filter out the invalid response
            }),
          ),
        ),
        filter(isValidResponseGuard), // Filter out invalid responses (null)
        map(({ data }) => this.openSuccessModal(data.surveyId)), // Open modal with survey id
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  handleClickAddSection(): void {
    fromEvent(this.addSectionBtn.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() =>
        this.addSurveySection({
          type: 'input',
          description: '',
          title: '',
          validator: {},
        }),
      );
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
    this.cmpRefs.forEach((componentRef) => {
      this.componentContainer.insert(componentRef.hostView);
    });
  }

  addSurveySection(model: SurveyModel) {
    const cmpRef = this.componentContainer.createComponent(
      CreateSurveyGroupComponent,
    );
    this.setupComponent(cmpRef);
    cmpRef.setInput('model', model);
    this.cmpRefs.push(cmpRef);
  }

  getSurveyModels(): Observable<SurveyModel[]> {
    const surveyModels = this.cmpRefs.map((cmpRef) =>
      cmpRef.instance.surveyModel(),
    );
    return of(surveyModels);
  }

  getRadioModels(models: SurveyModel[]): SurveyRadioModel[] {
    return models.filter(
      (model) => model.type === 'radio',
    ) as SurveyRadioModel[];
  }

  postSurveyModels(models: SurveyModel[]): Observable<
    HttpWrapper<{
      surveyId: string;
    }>
  > {
    return this.httpService.post<{ surveyId: string }>(
      environment.endpoints.saveSurvey,
      models,
    );
  }

  openFailureModal(): void {
    const cmp = createComponent(SurveyCreationFailedComponent, {
      environmentInjector: this.environmentInjector,
    });

    const modal = this.modalService.open(cmp);
    modal.instance.modalCloseEvent.subscribe(() => this.modalService.close());
  }

  openSuccessModal(surveyId: string): void {
    const cmp = createComponent(SurveySuccessfullySavedComponent, {
      environmentInjector: this.environmentInjector,
    });

    cmp.setInput('surveyId', surveyId);

    const modal = this.modalService.open(cmp);
    modal.setInput('isBackdropClosable', false);
    modal.instance.modalCloseEvent.subscribe(() => this.modalService.close());
  }

  generateRadioNames(models: SurveyRadioModel[]) {
    models.forEach((model, index) => {
      model.name = `radio-${index + 1}`;
    });
  }

  setupComponent(cmpRef: ComponentRef<CreateSurveyGroupComponent>) {
    cmpRef.instance.clonedSurvey.subscribe((model) =>
      this.insertComponentBeneath(cmpRef, model),
    );
    cmpRef.instance.remove.subscribe(() => this.removeSurveySection(cmpRef));
  }

  insertComponentBeneath(
    originalCmpRef: ComponentRef<CreateSurveyGroupComponent>,
    model: SurveyModel,
  ) {
    const originalCmpIndex = this.cmpRefs.indexOf(originalCmpRef);

    // Create a new component beneath the original component
    const clonedCmpRef = this.componentContainer.createComponent(
      CreateSurveyGroupComponent,
      {
        index: originalCmpIndex + 1,
      },
    );

    this.setupComponent(clonedCmpRef);
    clonedCmpRef.setInput('model', model);
    this.cmpRefs.splice(originalCmpIndex + 1, 0, clonedCmpRef);
  }

  removeSurveySection(cmpRef: ComponentRef<CreateSurveyGroupComponent>) {
    const index = this.cmpRefs.indexOf(cmpRef);

    // Only remove the component if there is atleast one component
    if (index !== -1 && this.hasComponents > 1) {
      this.cmpRefs.splice(index, 1);
      cmpRef.destroy();
    }
  }

  ngOnDestroy() {
    this.cmpRefs.forEach((comp) => comp.destroy());
    this.cmpRefs = [];

    this.destroy$.next();
    this.destroy$.complete();

    this.modalService.close();
  }
}
