import { Injectable } from '@angular/core';
import { SurveyModel, SurveyModelStorage, SurveyValidatorType, ValidatorConfig } from '../../util/type/survey-type';
import { customRequiredValidator, surveyValidatorMap } from '../../shared/form-validator/validators';
import { AbstractControl, Validators } from '@angular/forms';

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
    return [
      {
        type: 'input',
        placeholder: 'Enter your name',
        description: 'Please enter your name',
        title: 'Name',
        validator: {
          required: (control: AbstractControl) => customRequiredValidator('Name is required')(control)
        } as any
      }
    ];
  }
}