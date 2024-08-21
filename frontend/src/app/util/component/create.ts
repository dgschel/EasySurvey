import { Type } from "@angular/core";
import { FormControlComponentType, FormControlType, formComponentMap, formControlComponentMap } from "../type/survey-type";

export const createFormComponent = <T>(cmpType: FormControlType): Type<T> => formComponentMap[cmpType] as Type<T>;
export const createFormControlComponent = <T extends FormControlComponentType>(cmpType: FormControlType): Type<T> => formControlComponentMap[cmpType] as unknown as Type<T>;

