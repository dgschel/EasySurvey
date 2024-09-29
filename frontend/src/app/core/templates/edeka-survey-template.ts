import { SurveyInputModel, SurveySelectModel, SurveyModel, SurveyCheckboxModel, SurveyRadioModel } from "../../util/type/survey-type";
import { SurveyTemplateContract } from "../types/survey-template-contract";

export class EdekaSurveyTemplate implements SurveyTemplateContract {
  createSurveyInput(model?: SurveyInputModel): SurveyInputModel {
    return model
      ? { ...model }
      : {
        "type": "input",
        "title": "Ihr Name",
        "placeholder": "Bitte geben Sie Ihren Namen ein",
        "validator": {
          "required": {
            "value": true,
            "message": "Name ist erforderlich"
          }
        }
      }
  }

  createSurveySelect(model?: SurveySelectModel): SurveySelectModel {
    return model
      ? { ...model }
      : {
        "type": "select",
        "title": "Bevorzugte Abteilung",
        "validator": {},
        "options": [
          "Obst & Gemüse",
          "Fleisch & Wurst",
          "Backwaren",
          "Getränke",
          "Haushaltswaren"
        ],
      }
  }

  createSurveyRadio(model?: SurveyRadioModel): SurveyRadioModel {
    return model
      ? { ...model }
      : {
        "type": "radio",
        "title": "Wie bewerten Sie Ihr Einkaufserlebnis?",
        "validator": {},
        "options": [
          "Sehr gut",
          "Gut",
          "Befriedigend",
          "Ausreichend",
          "Schlecht"
        ],
        "name": "einkaufserlebnis"
      }
  }

  createSurveyCheckbox(model?: SurveyCheckboxModel): SurveyCheckboxModel {
    return model
      ? { ...model }
      : {
        "type": "checkbox",
        "title": "Welche Artikel kaufen Sie häufig?",
        "validator": {
          minSelected: { value: 2 }
        },
        "options": [
          "Milch",
          "Brot",
          "Käse",
          "Frisches Obst",
          "Getränke",
          "Reinigungsmittel"
        ]
      }
  }

  createPredefinedSurvey(): SurveyModel[] {
    const initialSurveyInput = this.createSurveyInput();
    const secondSurveyInput = this.createSurveyInput({
      ...initialSurveyInput, title: "Zusätzliches Feedback", placeholder: "Haben Sie noch Anmerkungen?", "validator": { "required": { value: true, message: 'Feedback ist erforderlich' }, "minLength": { "value": 10 } }
    });

    const initialSurveySelect = this.createSurveySelect();
    const initialSurveyRadio = this.createSurveyRadio();
    const initialSurveyCheckbox = this.createSurveyCheckbox();

    const inputs = [initialSurveyInput, secondSurveyInput];

    return [...inputs, initialSurveySelect, initialSurveyRadio, initialSurveyCheckbox];
  }
}