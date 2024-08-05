import { SurveyInputModel, SurveySelectModel, SurveyModel } from "../../util/type/survey-type";

export type SurveyTemplateContract = {
  createSurveyInput(model?: SurveyInputModel): SurveyInputModel;
  createSurveySelect(model?: SurveySelectModel): SurveySelectModel;
  createPredefinedSurvey(): SurveyModel[];
}
