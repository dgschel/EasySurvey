import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';

@Component({
  selector: 'app-survey-successfully-saved',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './survey-successfully-saved.component.html',
  styleUrl: './survey-successfully-saved.component.scss'
})
export class SurveySuccessfullySavedComponent implements OnInit, OnDestroy {
  private iconReg = inject(SvgIconRegistryService);

  ngOnInit(): void {
    this.iconReg.loadSvg('/svg/rosette-discount-check.svg', 'rosette-discount-check')?.subscribe();
  }

  ngOnDestroy(): void {
    this.iconReg.unloadSvg('rosette-discount-check');
  }
}
