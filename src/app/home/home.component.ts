import { Component } from '@angular/core';
import { SurveyFormComponent } from '../shared/feature/survey-form/survey-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SurveyFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent { }

