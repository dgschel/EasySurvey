import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DisplayQrCodeComponent } from "../../../display-qr-code/display-qr-code.component";

@Component({
  selector: 'app-submission-succesfully-saved',
  standalone: true,
  imports: [RouterLink, DisplayQrCodeComponent],
  templateUrl: './submission-succesfully-saved.component.html',
  styleUrl: './submission-succesfully-saved.component.scss'
})
export class SubmissionSuccesfullySavedComponent {
  @Input({ required: true }) surveyId!: string;
  @Input({ required: true }) svg!: string;
}
