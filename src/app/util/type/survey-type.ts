import { ComponentRef } from "@angular/core";
import { FormControlInputComponent } from "../../shared/feature/form-control-input/form-control-input.component";
import { FormControlSelectComponent } from "../../shared/feature/form-control-select/form-control-select.component";
import { FormSelectComponent } from "../../shared/feature/form-select/form-select.component";
import { CreateSurveyGroupComponent } from "../../shared/feature/create-survey-group/create-survey-group.component";
import { ValidatorFn } from "@angular/forms";

export type SurveyBaseType = {
  title: string;
  description: string;
  validator: Partial<SurveyValidatorMap>;
};

export type SurveyRefData = {
  ref: ComponentRef<CreateSurveyGroupComponent>,
  data: SurveyBaseType
}

export type SurveyValidatorType = 'required' | 'minLength';
export type SurveyValidatorMap = Record<SurveyValidatorType, ValidatorFn>;

export type FormControlComponentType = typeof FormControlInputComponent | typeof FormControlSelectComponent;
export type FormComponentType = typeof FormSelectComponent;

export type FormControlType = 'input' | 'select'

export const formControlComponentMap: Record<FormControlType, FormControlComponentType> = {
  input: FormControlInputComponent,
  select: FormControlSelectComponent,
}

export const FormControlNameMap: Record<FormControlType, string> = {
  input: 'Textbox',
  select: 'Dropdown',
}

export type SurveyInputModel = {
  type: 'input';
  placeholder?: string;
} & SurveyBaseType

export type SurveySelectModel = {
  type: 'select';
  options: string[];
} & SurveyBaseType

export type SurveyModel = SurveyInputModel | SurveySelectModel;