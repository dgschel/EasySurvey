import { ComponentRef } from "@angular/core";
import { ValidatorFn } from "@angular/forms";
import { FormSelectComponent } from "../../shared/feature/form-select/form-select.component";
import { CreateSurveyGroupComponent } from "../../shared/feature/create-survey-group/create-survey-group.component";
import { CreateFormInputComponent } from "../../shared/ui/create-form-input/create-form-input.component";
import { FormControlInputComponent } from "../../shared/feature/form-control-input/form-control-input.component";
import { FormControlSelectComponent } from "../../shared/feature/form-control-select/form-control-select.component";
import { FormControlRadioComponent } from "../../shared/feature/form-control-radio/form-control-radio.component";
import { FormControlCheckboxComponent } from "../../shared/feature/form-control-checkbox/form-control-checkbox.component";
import { MinLengthValidatorComponent } from "../../shared/ui/validator/min-length-validator/min-length-validator.component";
import { RequiredValidatorComponent } from "../../shared/ui/validator/required-validator/required-validator.component";
import { MinSelectedValidatorComponent } from "../../shared/ui/validator/min-selected-validator/min-selected-validator.component";

export type SurveyBaseType = {
  title: string;
  description?: string;
  validator: Partial<ValidatorConfig>;
};

export type SurveyTemplateModel = {
  name: SurveyName;
  models: SurveyModel[];
};

export type SurveyFormControlCount = Record<string, number>;
export type SurveyName = 'Standard' | 'Einkaufen' | 'Edeka'

export type SurveyRefData = {
  ref: ComponentRef<CreateSurveyGroupComponent>,
  data: SurveyModel
}

export type SurveyValidatorType = 'required' | 'minLength' | 'minSelected';
export type ValidatorFunction<T> = (data: T) => ValidatorFn;

export type SurveyValidatorMap<T> = Record<SurveyValidatorType, ValidatorFunction<T>>;
export type ValidatorConfig = {
  required: { value: boolean, message: string },
  minLength: { value: number },
  minSelected: { value: number }
}

export type FormComponentType = typeof CreateFormInputComponent | typeof FormSelectComponent;
export type FormControlComponentType = typeof FormControlInputComponent | typeof FormControlSelectComponent | typeof FormControlRadioComponent | typeof FormControlCheckboxComponent;

export type FormControlType = 'input' | 'select' | 'radio' | 'checkbox'

export type FormControlTypeValidatorMap = Record<FormControlType, SurveyValidatorType[]>;
export type ValidatorComponentType = typeof MinLengthValidatorComponent | typeof RequiredValidatorComponent | typeof MinSelectedValidatorComponent;
export type ValidatorComponentTypeMap = Record<SurveyValidatorType, ValidatorComponentType>;

// This will be used for the @Input() decorator to pass a function as callback
export interface ValidatorComponentInput<T = unknown> {
  onValidatorValueChange: (change: ValidatorValueChange<T>) => void;
  value: T; // This will be used to set the value of the input field. Currently typed as number | boolean | undefined
}

export type ValidatorValueChange<T = unknown> = {
  validatorType: SurveyValidatorType,
  value: T
}

export interface FormControlComponentValue {
  getValue<T>(): T,
  reset(): void
}

// user generated components
export const formComponentMap: Record<FormControlType, FormComponentType> = {
  input: CreateFormInputComponent, // TODO: Edit naming to distinquish user generated components and programatically form controls based on data
  select: FormSelectComponent,
  checkbox: FormSelectComponent,
  radio: FormSelectComponent
}

export const formControlComponentMap: Record<FormControlType, FormControlComponentType> = {
  input: FormControlInputComponent,
  select: FormControlSelectComponent,
  radio: FormControlRadioComponent,
  checkbox: FormControlCheckboxComponent
}

export const FormControlNameMap: Record<FormControlType, string> = {
  input: 'Textbox',
  select: 'Dropdown',
  radio: 'Radio',
  checkbox: 'Checkbox'
}

export const FormValidatorNameMap: Record<SurveyValidatorType, string> = {
  required: 'Erforderlich',
  minLength: 'Mindestlänge',
  minSelected: 'Mindestanzahl'
}

export type SurveyInputModel = {
  type: 'input';
  placeholder?: string;
} & SurveyBaseType

export type SurveyRadioModel = {
  type: 'radio';
  name: string
  options: string[]
} & SurveyBaseType

export type SurveyCheckboxModel = {
  type: 'checkbox';
  options: string[]
} & SurveyBaseType

export type SurveySelectModel = {
  type: 'select';
  options: string[];
} & SurveyBaseType

export type SurveyModel = SurveyInputModel | SurveySelectModel | SurveyCheckboxModel | SurveyRadioModel;

export type SurveyPaymentStatus = {
  status: 'paid' | 'not paid';
};