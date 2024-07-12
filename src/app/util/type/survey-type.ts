import { Type } from "@angular/core";
import { FormControlInputComponent } from "../../shared/feature/form-control-input/form-control-input.component";
import { FormControlSelectComponent } from "../../shared/feature/form-control-select/form-control-select.component";
import { InferObj } from "./inference-type";
import { FormSelectComponent } from "../../shared/feature/form-select/form-select.component";

export type SupportedComponents = typeof FormControlInputComponent | typeof FormSelectComponent | typeof FormControlSelectComponent;

export type FormControlType = 'input' | 'form-select' | 'select';

/**
 * Represents a generic component type
 * @template T - The type of the component
 */
export type DynamicComponentType<T> = {
  component: Type<T>;
  inputs: InferObj<T>
};

export const formControlComponentMap: Record<FormControlType, SupportedComponents> = {
  input: FormControlInputComponent,
  select: FormControlSelectComponent,
  "form-select": FormSelectComponent
}
