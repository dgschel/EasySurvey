import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SvgIconComponent } from 'angular-svg-icon';

import { CopyToClipboardComponent } from '../../../../feature/copy-to-clipboard/copy-to-clipboard.component';

@Component({
  selector: 'app-survey-successfully-saved',
  standalone: true,
  imports: [SvgIconComponent, CopyToClipboardComponent, RouterLink],
  templateUrl: './survey-successfully-saved.component.html',
  styleUrl: './survey-successfully-saved.component.scss'
})
export class SurveySuccessfullySavedComponent {
  @Input('surveyId') surveyId: string = '';
}
