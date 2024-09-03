import { Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOption } from '../../model/chart';

@Component({
  selector: 'app-survey-statistic-diagramm',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './survey-statistic-diagramm.component.html',
  styleUrl: './survey-statistic-diagramm.component.scss'
})
export class SurveyStatisticDiagrammComponent {
  @Input() chartOption: Partial<ChartOption> = {}
}
