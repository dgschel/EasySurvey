import { KeyValuePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SubmissionInputs } from '../../../util/type/statistic';
import { BasicCardComponent } from '../../../shared/ui/basic-card/basic-card.component';

@Component({
  selector: 'app-table-statistic',
  standalone: true,
  imports: [KeyValuePipe, BasicCardComponent],
  templateUrl: './table-statistic.component.html',
  styleUrl: './table-statistic.component.scss'
})
export class TableStatisticComponent {
  @Input('submission') submission: Record<string, SubmissionInputs> = {};

  get hasSubmission() {
    return Object.keys(this.submission).length > 0;
  }
}
