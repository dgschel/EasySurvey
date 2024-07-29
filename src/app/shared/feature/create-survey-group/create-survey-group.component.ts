import { Component, ComponentRef, computed, effect, output, signal, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';

import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';
import { FormComponentType, SurveyInputModel, SurveyModel, SurveyModelStorage, SurveySelectModel, SurveyValidatorType } from '../../../util/type/survey-type';
import { CreateComponentComponent } from "../../ui/create-component/create-component.component";
import { FormSelectComponent } from '../form-select/form-select.component';
import { CreateFormInputComponent } from '../../ui/create-form-input/create-form-input.component';
import { SurveyBase } from '../../../core/model/survey-base';

@Component({
  selector: 'app-create-survey-group',
  standalone: true,
  imports: [FormsModule, BasicCardComponent, CreateComponentComponent, FormSelectComponent, NgComponentOutlet],
  templateUrl: './create-survey-group.component.html',
  styleUrl: './create-survey-group.component.scss'
})
export class CreateSurveyGroupComponent {
  surveyBaseModel = new SurveyBase();
  surveyComponentModel = signal<SurveyModel>(this.getDefaultSurveyInputModel());
  surveyModel = computed(() => ({
    ...this.surveyComponentModel(),
    ...this.surveyBaseModel.state()
  }) as SurveyModelStorage);
  hasDescription: boolean = false;

  remove = output<void>();
  stateChanged = output<SurveyModelStorage>();

  cmpRef: ComponentRef<FormComponentType> | undefined;
  @ViewChild('component', { read: ViewContainerRef }) component!: ViewContainerRef;

  onCreateComponent(cmp: Type<FormComponentType>) {
    this.component.clear();
    this.cmpRef?.destroy();
    this.cmpRef = this.component.createComponent(cmp);
    this.cmpRef.changeDetectorRef.detectChanges();

    if (this.cmpRef.instance instanceof CreateFormInputComponent) {
      const surveyInput = this.getDefaultSurveyInputModel();
      this.surveyComponentModel.set(surveyInput);
    } else if (this.cmpRef.instance instanceof FormSelectComponent) {
      const surveySelect = this.getDefaultSurveySelectModel();
      this.surveyComponentModel.set(surveySelect);
      this.cmpRef.setInput('optionsChangedCallback', (updatedOptions: string[]) => this.updateSelectOptions(updatedOptions));
    }
  }

  constructor() {
    effect(() => this.stateChanged.emit(this.surveyModel()))
  }

  updateSelectOptions(options: string[]) {
    const surveyModel: SurveySelectModel = {
      ...this.surveyBaseModel.state(),
      type: 'select',
      options,
    };
    this.surveyComponentModel.set(surveyModel);
  }

  setMinlengthValidator(value: number) {
    if (value < 1) this.surveyBaseModel.deleteValidator('minLength');
    else this.surveyBaseModel.updateValidator({ minLength: { message: `Answer must be at least ${value} characters long `, value } });
  }

  setRequiredValidator(checked: boolean) {
    checked
      ? this.surveyBaseModel.updateValidator({ required: { message: 'This field is required' } })
      : this.surveyBaseModel.deleteValidator('required');
  }

  getDefaultSurveyInputModel(): SurveyInputModel {
    return {
      ...this.surveyBaseModel.state(),
      type: 'input',
    };
  }

  getDefaultSurveySelectModel(): SurveySelectModel {
    return {
      ...this.surveyBaseModel.state(),
      type: 'select',
      options: [],
    };
  }
}
