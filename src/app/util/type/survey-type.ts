import { FormControlInputComponent } from "../../shared/feature/form-control-input/form-control-input.component";
import { FormControlSelectComponent } from "../../shared/feature/form-control-select/form-control-select.component";
import { FormSelectComponent } from "../../shared/feature/form-select/form-select.component";

export type FormControlComponentType = typeof FormControlInputComponent | typeof FormControlSelectComponent;
export type FormComponentType = typeof FormSelectComponent;

export type FormControlType = 'input' | 'select';

export const formControlComponentMap: Record<FormControlType, FormControlComponentType> = {
  input: FormControlInputComponent,
  select: FormControlSelectComponent,
}
