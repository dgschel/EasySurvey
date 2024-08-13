import { SurveyInputModel, SurveySelectModel, SurveyModel, SurveyRadioModel, SurveyCheckboxModel } from "../../util/type/survey-type";

export type SurveyTemplateContract = {
  createSurveyInput(model?: SurveyInputModel): SurveyInputModel;
  createSurveySelect(model?: SurveySelectModel): SurveySelectModel;
  createSurveyRadio(model?: SurveyRadioModel): SurveyRadioModel;
  createSurveyCheckbox(model?: SurveyCheckboxModel): SurveyCheckboxModel;
  createPredefinedSurvey(): SurveyModel[];
}
