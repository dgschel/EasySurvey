import { Component, Input } from '@angular/core';
import { CopyToClipboardComponent } from '../../../../feature/copy-to-clipboard/copy-to-clipboard.component';

@Component({
  selector: 'app-survey-update-payment-status-failed',
  standalone: true,
  imports: [CopyToClipboardComponent],
  templateUrl: './survey-update-payment-status-failed.component.html',
  styleUrl: './survey-update-payment-status-failed.component.scss'
})
export class SurveyUpdatePaymentStatusFailedComponent {
  @Input({ required: true }) surveyId: string = '';
}
