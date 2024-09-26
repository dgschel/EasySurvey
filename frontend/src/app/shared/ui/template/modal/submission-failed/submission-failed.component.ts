import { Component, Input } from '@angular/core';
import { CopyToClipboardComponent } from "../../../../feature/copy-to-clipboard/copy-to-clipboard.component";

@Component({
  selector: 'app-submission-failed',
  standalone: true,
  imports: [CopyToClipboardComponent],
  templateUrl: './submission-failed.component.html',
  styleUrl: './submission-failed.component.scss'
})
export class SubmissionFailedComponent {
  @Input({ required: true }) surveyId!: string;
}
