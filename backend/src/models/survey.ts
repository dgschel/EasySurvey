/**
 * Survey types needs to match the types used in the frontend
 * path: frontend\src\app\util\type\survey-type.ts
 */

export type SurveyBaseType = {
  title: string;
  description?: string;
  validator: Partial<ValidatorConfig>;
};

export type ValidatorConfig = {
  required: { message: string },
  minLength: { value: number }
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