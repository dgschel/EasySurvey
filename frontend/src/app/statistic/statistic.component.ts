import { Component } from '@angular/core';
import { SurveyStatisticDiagrammComponent } from './component/survey-statistic-diagramm/survey-statistic-diagramm.component';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [SurveyStatisticDiagrammComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent {

}
