import { Type } from "@angular/core";
import { FormControlInputComponent } from "../../shared/feature/form-control-input/form-control-input.component";
import { FormControlSelectComponent } from "../../shared/feature/form-control-select/form-control-select.component";
import { InferObj } from "./inference-type";

export type AllowedComponents = typeof FormControlInputComponent | typeof FormControlSelectComponent;

export const mappedComponents: Record<FormSurveyComponent, AllowedComponents> = {
  input: FormControlInputComponent,
  select: FormControlSelectComponent,
}

export type FormSurveyComponent = 'input' | 'select';

export type ComponentType<T> = {
  component: Type<T>;
  inputs: InferObj<T>
};