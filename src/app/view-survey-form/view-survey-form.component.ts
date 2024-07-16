import { Component, inject, OnInit } from '@angular/core';
import { SurveyDataService } from '../core/service/survey-data.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { SurveyModel } from '../util/type/survey-type';

@Component({
  selector: 'app-view-survey-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './view-survey-form.component.html',
  styleUrl: './view-survey-form.component.scss'
})
export class ViewSurveyFormComponent implements OnInit {
  private surveyDataService = inject(SurveyDataService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    sections: this.fb.array([])
  });

  get sections() {
    return this.form.get('sections') as FormArray;
  }

  ngOnInit(): void {
    const formData = this.surveyDataService.getSurveyData();
    const formGroups = this.createSurveyFormGroups(formData);
    formGroups.forEach(group => this.sections.push(group));
  }

  get surveyGroups() {
    return this.sections.controls as FormGroup[];
  }

  createSurveyFormGroups(models: SurveyModel[]): FormGroup[] {
    return models.map(m => {
      return this.fb.group({
        text: ['', m.required ? Validators.required : null],
      })
    });
  }
}