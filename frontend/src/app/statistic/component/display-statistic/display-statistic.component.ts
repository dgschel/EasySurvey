import { Component, Input } from '@angular/core';
import { StatisticalInfo } from '../../model/statistic';

@Component({
  selector: 'app-display-statistic',
  standalone: true,
  imports: [],
  templateUrl: './display-statistic.component.html',
  styleUrl: './display-statistic.component.scss'
})
export class DisplayStatisticComponent {
  @Input('statisticData') statistics: StatisticalInfo[] = [];
}
