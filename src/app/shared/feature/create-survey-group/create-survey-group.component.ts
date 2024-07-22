import { AfterViewInit, Component, ComponentRef, computed, effect, output, signal, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';

import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';
import { FormControlComponentType, SurveyInputModel, SurveyModel, SurveySelectModel, SurveyValidatorType } from '../../../util/type/survey-type';
import { surveyValidatorMap } from '../../form-validator/validators';
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
  surveyBaseModel = new SurveyBase<SurveyModel>();
  surveyComponentModel = signal<SurveyModel>(this.getDefaultSurveyInputModel());
  surveyModel = computed(() => {
    return {
      ...this.surveyComponentModel(),
      ...this.surveyBaseModel.state()
    };
  });
  hasDescription: boolean = false;

  remove = output<void>();
  stateChanged = output<SurveyModel>();

  cmpRef: ComponentRef<FormControlComponentType> | undefined;
  @ViewChild('component', { read: ViewContainerRef }) component!: ViewContainerRef;

  onCreateComponent(cmp: Type<FormControlComponentType>) {
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
    effect(() => {
      this.stateChanged.emit(this.surveyModel());
    })
  }

  updateSelectOptions(options: string[]) {
    const surveyModel: SurveySelectModel = {
      ...this.surveyBaseModel.state(),
      type: 'select',
      options,
    };
    this.surveyComponentModel.set(surveyModel);
  }

  // Can be moved to a service. For now, it's here for simplicity
  setValidatorFn = (validatorType: SurveyValidatorType, checked: boolean) => {
    const validatorFn = surveyValidatorMap[validatorType]
    this.surveyBaseModel.validatorMap.update((prev) => {
      if (checked) {
        return { ...prev, [validatorType]: validatorFn }
      } else {
        delete prev[validatorType];
        return { ...prev };
      }
    });
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
