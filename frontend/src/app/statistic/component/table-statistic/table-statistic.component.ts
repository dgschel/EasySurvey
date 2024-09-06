import { KeyValuePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SubmissionInputCount } from '../../../util/type/statistic';

@Component({
  selector: 'app-table-statistic',
  standalone: true,
  imports: [KeyValuePipe],
  templateUrl: './table-statistic.component.html',
  styleUrl: './table-statistic.component.scss'
})
export class TableStatisticComponent {
  @Input('statistic') statistic: Record<string, SubmissionInputCount> = {};
}
