import { Injectable } from '@angular/core';
import { OmitValidator, SurveyInputModel, SurveyModel, SurveyModelStorage, SurveySelectModel, SurveyValidatorType, ValidatorConfig } from '../../util/type/survey-type';
import { customMinLengthValidator, customRequiredValidator, surveyValidatorMap } from '../../shared/form-validator/validators';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SurveyDataService {
  getSurveyData(): SurveyModelStorage[] {
    const storageData = localStorage.getItem('surveyData') ?? "";
    const storage = JSON.parse(storageData) as SurveyModelStorage[];

    const entries = storage.map((entry: SurveyModelStorage) => {
      const validator = Object.keys(entry.validator).reduce((acc, curr) => {
        const validatorConfig = surveyValidatorMap[curr as SurveyValidatorType];
        const validatorFn = validatorConfig(entry.validator);
        return {
          ...acc,
          [curr]: validatorFn
        }
      }, {});

      return {
        ...entry,
        validator
      }
    });

    return entries;
  }

  getTestSurveyData(): SurveyModel[] {
    const inputs: OmitValidator<SurveyInputModel>[] = [
      {
        type: 'input',
        placeholder: 'Enter your name2',
        description: 'Please enter your name',
        title: 'Name',
        validator: [customRequiredValidator('Name is required 2'), customMinLengthValidator(3, 'Min length of 3 characters')]
      },
      {
        type: 'input',
        placeholder: 'Enter your name3',
        description: 'Please enter your name',
        title: 'Name',
        validator: [customRequiredValidator('Name is required 3'), customMinLengthValidator(3, 'Min length of 3 characters')]
      },
      {
        type: 'input',
        placeholder: 'Enter your name4',
        description: 'Please enter your name',
        title: 'Name',
        validator: [customRequiredValidator('Name is required 4'), customMinLengthValidator(3, 'Min length of 3 characters')]
      }
    ]

    const selects: OmitValidator<SurveySelectModel>[] = [
      {
        type: 'select',
        options: ['Option 1', 'Option 2', 'Option 3'],
        description: 'Please select an option',
        title: 'Select an option',
        validator: [customRequiredValidator('Option is required')]
      },
      {
        type: 'select',
        options: ['Option 1', 'Option 2', 'Option 3'],
        description: 'Please select an option',
        title: 'Select an option',
        validator: [customRequiredValidator('Option is required')]
      },
      {
        type: 'select',
        options: ['Option 1', 'Option 2', 'Option 3'],
        description: 'Please select an option',
        title: 'Select an option',
        validator: [customRequiredValidator('Option is required')]
      }
    ];

    return [...inputs, ...selects] as SurveyModel[];
  }
}