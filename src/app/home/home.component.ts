import { Component, inject } from '@angular/core';
import { SurveyFormComponent } from '../shared/feature/survey-form/survey-form.component';
import { SurveyDataService } from '../core/service/survey-data.service';
import { ActivatedRoute } from '@angular/router';
import { SurveyModel } from '../util/type/survey-type';
import { FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, SurveyFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  surveyDataService = inject(SurveyDataService);
  route = inject(ActivatedRoute);

  models: SurveyModel[] = [];

  form = new FormGroup({
    sections: new FormArray([])
  })

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const models = this.surveyDataService.fetchSurveyData(id);
      if (models) {
        this.models = models;
      }
    }
  }
}

