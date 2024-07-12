import { FormControlType, SupportedComponents, formControlComponentMap } from "../type/survey-type";

export const createFormControlComponent = (cmpType: FormControlType): SupportedComponents => formControlComponentMap[cmpType]
