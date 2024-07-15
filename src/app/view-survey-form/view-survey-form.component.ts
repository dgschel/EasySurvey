import { Component, OnInit } from '@angular/core';
import { SurveyDataModel } from '../core/service/survey-data.service';

@Component({
  selector: 'app-view-survey-form',
  standalone: true,
  imports: [],
  templateUrl: './view-survey-form.component.html',
  styleUrl: './view-survey-form.component.scss'
})
export class ViewSurveyFormComponent implements OnInit {
  surveyDataModel: SurveyDataModel[] = [];

  ngOnInit(): void {
    const data = localStorage.getItem('surveyData');
    if (data) {
      this.surveyDataModel = JSON.parse(data);
    }
  }
}