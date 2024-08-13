import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentRef, computed, Input, output, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';

import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';
import { FormComponentType, FormControlType, SurveyCheckboxModel, SurveyInputModel, SurveyModel, SurveyRadioModel, SurveySelectModel } from '../../../util/type/survey-type';
import { CreateComponentComponent } from "../../ui/create-component/create-component.component";
import { FormSelectComponent } from '../form-select/form-select.component';
import { SurveyBase } from '../../../core/model/survey-base';
import { createFormComponent } from '../../../util/component/create';

@Component({
  selector: 'app-create-survey-group',
  standalone: true,
  imports: [FormsModule, BasicCardComponent, CreateComponentComponent, FormSelectComponent, NgComponentOutlet],
  templateUrl: './create-survey-group.component.html',
  styleUrl: './create-survey-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateSurveyGroupComponent implements AfterViewInit {
  surveyBaseModel = new SurveyBase();
  surveyComponentModel = signal<SurveyModel>(this.getDefaultSurveyInputModel());
  surveyModel = computed(() => ({
    ...this.surveyComponentModel(),
    ...this.surveyBaseModel.state()
  }));
  hasDescription: boolean = false;
  remove = output<void>();

  // Input model from parent component. Default value is a SurveyModel object
  @Input('model') model: SurveyModel = this.surveyModel();
  @ViewChild('component', { read: ViewContainerRef }) componentRef!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.surveyBaseModel.setState(this.model);
    this.hasDescription = !!this.model.description;
  }

  onControlTypeChanged(controlType: FormControlType) {
    this.componentRef.clear();
    const cmpType = createFormComponent<FormComponentType>(controlType);
    const cmpRef = this.componentRef.createComponent(cmpType);

    if (controlType === 'input') {
      this.createFormInputComponent();
    } else if (controlType === 'select' || controlType === 'checkbox' || controlType === 'radio') {
      this.createFormChoiceComponent(controlType, cmpRef);
    }
  }

  private createFormInputComponent() {
    const surveyInput = this.getDefaultSurveyInputModel();
    this.surveyComponentModel.set(surveyInput);
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
      ? this.surveyBaseModel.updateValidator({ required: { message: 'Dieses Feld ist erforderlich' } })
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
