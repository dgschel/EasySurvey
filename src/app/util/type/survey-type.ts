import { ComponentRef } from "@angular/core";
import { ValidatorFn } from "@angular/forms";
import { FormSelectComponent } from "../../shared/feature/form-select/form-select.component";
import { CreateSurveyGroupComponent } from "../../shared/feature/create-survey-group/create-survey-group.component";
import { CreateFormInputComponent } from "../../shared/ui/create-form-input/create-form-input.component";
import { FormControlInputComponent } from "../../shared/feature/form-control-input/form-control-input.component";
import { FormControlSelectComponent } from "../../shared/feature/form-control-select/form-control-select.component";

export type SurveyBaseType = {
  title: string;
  description: string;
  validator: Partial<SurveyValidatorMap<ValidatorConfig>>; // TODO: find a better way to type this. The current type makes it hard to pass custom validators
};

export type SurveyTemplateModel = {
  name: string;
  models: SurveyModel[];
};

export type SurveyFormControlCount = Record<string, number>;
export type SurveyName = 'Standard' | 'Einkaufsformular';

export type SurveyRefData = {
  ref: ComponentRef<CreateSurveyGroupComponent>,
  data: SurveyModelStorage
}

export type SurveyValidatorType = 'required' | 'minLength';
export type ValidatorFunction<T> = (data: T) => ValidatorFn;

export type SurveyValidatorMap<T> = Record<SurveyValidatorType, ValidatorFunction<T>>;
export type ValidatorConfig = {
  required: { message: string },
  minLength: { message: string, value: number }
}

export type FormComponentType = typeof CreateFormInputComponent | typeof FormSelectComponent;
export type FormControlComponentType = typeof FormControlInputComponent | typeof FormControlSelectComponent;

export type FormControlType = 'input' | 'select'

// user generated components
export const formComponentMap: Record<FormControlType, FormComponentType> = {
  input: CreateFormInputComponent, // TODO: Edit naming to distinquish user generated components and programatically form controls based on data
  select: FormSelectComponent,
}

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
export type SurveyModelStorage = Omit<SurveyModel, 'validator'> & {
  validator: Partial<ValidatorConfig>
};

export type SurveyValidatorFn = Record<SurveyValidatorType, ValidatorFn>
export type OmitValidator<T> = Omit<T, 'validator'> & {
  validator: ValidatorFn[];
};