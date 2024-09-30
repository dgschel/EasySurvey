import { Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

import { StatisticalInfo } from '../../model/statistic';

@Component({
  selector: 'app-display-statistic',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './display-statistic.component.html',
  styleUrl: './display-statistic.component.scss'
})
export class DisplayStatisticComponent{
  @Input('statistics') statistics: StatisticalInfo[] = [];
}
