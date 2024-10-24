import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentRef, computed, createComponent, EnvironmentInjector, inject, Injector, Input, output, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';
import { CdkDrag, CdkDragHandle, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

import { SvgIconComponent } from 'angular-svg-icon';

import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';
import { FormComponentType, FormControlType, SurveyCheckboxModel, SurveyInputModel, SurveyModel, SurveyRadioModel, SurveySelectModel, SurveyValidatorType, ValidatorValueChange } from '../../../util/type/survey-type';
import { CreateComponentComponent } from "../../ui/create-component/create-component.component";
import { FormSelectComponent } from '../form-select/form-select.component';
import { SurveyBase } from '../../../core/model/survey-base';
import { createFormComponent } from '../../../util/component/create';
import { validatorFactory } from '../../../core/provider/validator';
import { AbstractValidator } from '../../../core/model/validator';
import { DynamicValidatorComponent } from "../../ui/validator/dynamic-validator/dynamic-validator.component";
import { ModalService } from '../../../core/service/modal.service';
import { SurveyPreviewComponent } from '../../../features/survey/components/survey-preview/survey-preview.component';

@Component({
  selector: 'app-create-survey-group',
  standalone: true,
  imports: [FormsModule, BasicCardComponent, SvgIconComponent, CreateComponentComponent, FormSelectComponent, NgComponentOutlet, CdkDrag, CdkDragHandle, CdkDragPlaceholder, DynamicValidatorComponent],
  templateUrl: './create-survey-group.component.html',
  styleUrl: './create-survey-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [validatorFactory('input')], // Provide the default validator for the input control
})
export class CreateSurveyGroupComponent implements AfterViewInit {
  private modalService = inject(ModalService);
  private environmentInjector = inject(EnvironmentInjector);

  surveyBaseModel = new SurveyBase();
  surveyComponentModel = signal<SurveyModel>(this.getDefaultSurveyInputModel());
  surveyModel = computed(() => ({
    ...this.surveyComponentModel(),
    ...this.surveyBaseModel.state()
  }));
  hasDescription: boolean = false;
  remove = output<void>();
  clonedSurvey = output<SurveyModel>();

  validators: SurveyValidatorType[] = [];

  // Input model from parent component. Default value is a SurveyModel object
  @Input('model') model: SurveyModel = this.surveyModel();
  @ViewChild('component', { read: ViewContainerRef }) componentRef!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.surveyBaseModel.setState(this.model);
    this.hasDescription = !!this.model.description;
  }

  onControlTypeChanged(controlType: FormControlType) {
    this.surveyBaseModel.resetValidator(); // Reset the validators when the control type changes

    // Configure the validators for the new control type
    this.configureValidators(controlType);

    this.componentRef.clear();
    const cmpType = createFormComponent<FormComponentType>(controlType);
    const cmpRef = this.componentRef.createComponent(cmpType);

    if (controlType === 'input') {
      this.createFormInputComponent();
    } else if (controlType === 'select' || controlType === 'checkbox' || controlType === 'radio') {
      this.createFormChoiceComponent(controlType, cmpRef);
    }
  }

  onValidatorValueChange(change: ValidatorValueChange) {
    if (change.validatorType === 'required') {
      this.setRequiredValidator(change.value as boolean);
    } else if (change.validatorType === 'minLength') {
      this.setMinlengthValidator(change.value as number);
    } else if (change.validatorType === 'minSelected') {
      this.setMinSelectedValidator(change.value as number);
    }
  }

  resetDescriptionState(checked: boolean) {
    this.hasDescription = checked;

    // Reset the description when the checkbox is unchecked
    if (!checked) this.surveyBaseModel.description.set('');
  }

  private createFormInputComponent() {
    const surveyInput = this.getDefaultSurveyInputModel();
    this.surveyComponentModel.set(surveyInput);
  }

  private configureValidators(controlType: FormControlType) {
    // The validator factory is a function that returns a new instance of the validator class
    // There is a different validator class for each control type
    // No need to cleanup the injector because it will be garbage collected
    const validatorInjector = Injector.create({
      providers: [validatorFactory(controlType)]
    })

    this.validators = validatorInjector.get(AbstractValidator).getValidators();
  }

  private createFormChoiceComponent(modelType: Exclude<FormControlType, 'input'>, cmpRef: ComponentRef<FormComponentType>) {
    const { options } = this.model as SurveySelectModel // Get the options from any model thats supports options
    let model: SurveyModel = {} as SurveyModel;

    if (modelType === 'select') {
      model = this.getDefaultSurveySelectModel(options);
    } else if (modelType === 'checkbox') {
      model = this.getDefaultSurveyCheckboxModel(options);
    } else if (modelType === 'radio') {
      model = this.getDefaultSurveyRadioModel(options);
    }

    this.surveyComponentModel.set(model);

    cmpRef.setInput('controlModel', { modelType, options: options || [] });
    cmpRef.setInput('optionsChangedCallback', (updatedOptions: string[]) => this.updateOptions(updatedOptions));
  }

  clone() {
    this.clonedSurvey.emit(this.surveyModel());
  }

  preview() {
    const cmp = createComponent(SurveyPreviewComponent, {
      environmentInjector: this.environmentInjector,
    });

    cmp.setInput('models', [this.surveyModel()]);
    const modal = this.modalService.open(cmp);
    modal.instance.modalCloseEvent.subscribe(() => this.modalService.close());
  }

  updateOptions(options: string[]) {
    this.surveyComponentModel.update((prev) => ({ ...prev, options }));
  }

  setMinlengthValidator(value: number) {
    if (value < 1) this.surveyBaseModel.deleteValidator('minLength');
    else this.surveyBaseModel.updateValidator({ minLength: { value } });
  }

  setMinSelectedValidator(value: number) {
    if (value < 1) this.surveyBaseModel.deleteValidator('minSelected');
    else this.surveyBaseModel.updateValidator({ minSelected: { value } });
  }

  setRequiredValidator(checked: boolean) {
    checked
      ? this.surveyBaseModel.updateValidator({ required: { value: checked, message: 'Dieses Feld ist erforderlich' } })
      : this.surveyBaseModel.deleteValidator('required');
  }

  getDefaultSurveyInputModel(): SurveyInputModel {
    return {
      ...this.surveyBaseModel.state(),
      placeholder: 'Antwort eingeben',
      type: 'input',
    };
  }

  getDefaultSurveySelectModel(options: string[] = []): SurveySelectModel {
    return {
      ...this.surveyBaseModel.state(),
      type: 'select',
      options
    };
  }

  getDefaultSurveyCheckboxModel(options: string[] = []): SurveyCheckboxModel {
    return {
      ...this.surveyBaseModel.state(),
      type: 'checkbox',
      options
    };
  }

  getDefaultSurveyRadioModel(options: string[] = []): SurveyRadioModel {
    return {
      ...this.surveyBaseModel.state(),
      type: 'radio',
      name: 'radio',
      options,
    };
  }
}
