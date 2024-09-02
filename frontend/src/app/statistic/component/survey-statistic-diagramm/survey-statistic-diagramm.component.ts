import { Component } from '@angular/core';
import { ApexChart, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-survey-statistic-diagramm',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './survey-statistic-diagramm.component.html',
  styleUrl: './survey-statistic-diagramm.component.scss'
})
export class SurveyStatisticDiagrammComponent {
  chart: ApexChart = {
    type: 'bar',
    height: 350
  }

  title = {
    text: "Survey Result",
  };

  series = [{
    name: "Survey Result",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }];
}
