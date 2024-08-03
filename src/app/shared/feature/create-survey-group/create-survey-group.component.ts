import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentRef, computed, Input, output, signal, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgComponentOutlet } from '@angular/common';

import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';
import { FormComponentType, SurveyInputModel, SurveyModel, SurveySelectModel } from '../../../util/type/survey-type';
import { CreateComponentComponent } from "../../ui/create-component/create-component.component";
import { FormSelectComponent } from '../form-select/form-select.component';
import { CreateFormInputComponent } from '../../ui/create-form-input/create-form-input.component';
import { SurveyBase } from '../../../core/model/survey-base';

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

  @Input('model') model: SurveyModel = this.surveyModel();
  @ViewChild('component', { read: ViewContainerRef }) component!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.surveyBaseModel.setState(this.model);
    this.hasDescription = !!this.model.description;
  }

  onCreateComponent(cmp: Type<FormComponentType>) {
    this.component.clear();
    const cmpRef = this.component.createComponent(cmp);
    cmpRef.changeDetectorRef.detectChanges();

    if (cmpRef.instance instanceof CreateFormInputComponent) {
      const surveyInput = this.getDefaultSurveyInputModel();
      this.surveyComponentModel.set(surveyInput);
    } else if (cmpRef.instance instanceof FormSelectComponent) {
      const surveySelect = this.getDefaultSurveySelectModel();
      this.surveyComponentModel.set(surveySelect);
      cmpRef.setInput('optionsChangedCallback', (updatedOptions: string[]) => this.updateSelectOptions(updatedOptions));
    }
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
    else this.surveyBaseModel.updateValidator({ minLength: { value } });
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

  getDefaultSurveySelectModel(): SurveySelectModel {
    return {
      ...this.surveyBaseModel.state(),
      type: 'select',
      options: [],
    };
  }
}
