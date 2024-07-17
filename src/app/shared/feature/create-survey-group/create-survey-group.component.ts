import { Component, effect, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SurveyBase } from '../../../core/model/survey-base';
import { BasicCardComponent } from '../../ui/basic-card/basic-card.component';
import { SurveyBaseType } from '../../../util/type/survey-type';

@Component({
  selector: 'app-create-survey-group',
  standalone: true,
  imports: [FormsModule, BasicCardComponent],
  templateUrl: './create-survey-group.component.html',
  styleUrl: './create-survey-group.component.scss'
})
export class CreateSurveyGroupComponent {
  surveyBaseModel = new SurveyBase();
  hasDescription: boolean = false;

  remove = output<void>();
  stateChanged = output<SurveyBaseType>();

  constructor() {
    effect(() => {
      this.stateChanged.emit(this.surveyBaseModel.state())
    })
  }
}
