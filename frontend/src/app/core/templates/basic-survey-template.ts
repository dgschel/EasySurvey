import { SurveyInputModel, SurveySelectModel, SurveyModel, SurveyCheckboxModel, SurveyRadioModel } from "../../util/type/survey-type";
import { SurveyTemplateContract } from "../types/survey-template-contract";

export class BasicSurveyTemplate implements SurveyTemplateContract {
  createSurveyRadio(model?: SurveyRadioModel): SurveyRadioModel {
    throw new Error("Method not implemented.");
  }
  createSurveyCheckbox(model?: SurveyCheckboxModel): SurveyCheckboxModel {
    throw new Error("Method not implemented.");
  }
  createSurveyInput(model?: SurveyInputModel): SurveyInputModel {
    return model
      ? { ...model }
      : {
        title: 'Input Title',
        description: 'Input Description',
        type: 'input',
        placeholder: 'Input Placeholder',
        validator: {}
      };
  }

  createSurveySelect(model?: SurveySelectModel): SurveySelectModel {
    return model
      ? { ...model }
      :
      {
        title: 'Select Title',
        description: 'Select Description',
        type: 'select',
        options: [],
        validator: {}
      };
  }

  createPredefinedSurvey(): SurveyModel[] {
    return [this.createSurveyInput(), this.createSurveySelect()];
  }
}