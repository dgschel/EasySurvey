import { Validators } from "@angular/forms";
import { SurveyInputModel, SurveySelectModel, SurveyModel } from "../../util/type/survey-type";
import { SurveyTemplateContract } from "../types/survey-template-contract";

export class PurchaseSurveyTemplate implements SurveyTemplateContract {
  createSurveyInput(model?: SurveyInputModel): SurveyInputModel {
    return model
      ? { ...model }
      : {
        title: 'Purchase Input Title',
        description: 'Purchase Input Description',
        type: 'input',
        placeholder: 'Purchase Input Placeholder',
        validator: {}
      };
  }

  createSurveySelect(model?: SurveySelectModel): SurveySelectModel {
    return model
      ? { ...model }
      : {
        title: 'Purchase Select Title',
        description: 'Purchase Select Description',
        type: 'select',
        options: ["Option 1", "Option 2"],
        validator: {}
      };
  }

  createPredefinedSurvey(): SurveyModel[] {
    const initialSurveyInput = this.createSurveyInput();
    const secondSurveyInput = this.createSurveyInput({ ...initialSurveyInput, title: 'Second Purchase Input Title', validator: { required: { message: 'Dieses Feld ist erforderlich' } } });
    const thirdSurveyInput = this.createSurveyInput({ ...secondSurveyInput, title: 'Third Purchase Input Title', placeholder: 'Third Purchase Input Placeholder', validator: { ...secondSurveyInput.validator, minLength: { value: 5 } } });

    const initialSurveySelect = this.createSurveySelect();
    const secondSurveySelect = this.createSurveySelect({ ...initialSurveySelect, title: 'Second Purchase Select Title' });
    const thirdSurveySelect = this.createSurveySelect({ ...secondSurveySelect, title: 'Third Purchase Select Title', options: ['Option 1', 'Option 2', 'Option 3'], validator: { required: { message: 'Dieses Feld ist erforderlich' } } });

    const inputs = [initialSurveyInput, secondSurveyInput, thirdSurveyInput];
    const selects = [initialSurveySelect, secondSurveySelect, thirdSurveySelect];

    return [...inputs, ...selects];
  }
}