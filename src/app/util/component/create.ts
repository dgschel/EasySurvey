import { Type } from "@angular/core";
import { FormControlType, formControlComponentMap } from "../type/survey-type";

export const createFormControlComponent = <T>(cmpType: FormControlType): Type<T> => formControlComponentMap[cmpType] as Type<T>;
