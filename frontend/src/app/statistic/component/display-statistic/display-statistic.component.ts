import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';

import { StatisticalInfo } from '../../model/statistic';

@Component({
  selector: 'app-display-statistic',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './display-statistic.component.html',
  styleUrl: './display-statistic.component.scss'
})
export class DisplayStatisticComponent implements OnInit, OnDestroy {
  private iconReg = inject(SvgIconRegistryService);

  @Input('statistic') statistics: StatisticalInfo[] = [];

  ngOnInit(): void {
    this.iconReg.loadSvg('/svg/stopwatch.svg', 'stopwatch')?.subscribe();
    this.iconReg.loadSvg('/svg/check.svg', 'check')?.subscribe();
    this.iconReg.loadSvg('/svg/arrow-up-right.svg', 'arrow-up-right')?.subscribe();
    this.iconReg.loadSvg('/svg/x.svg', 'x')?.subscribe();
  }

  ngOnDestroy(): void {
    this.iconReg.unloadSvg('stopwatch');
    this.iconReg.unloadSvg('check');
    this.iconReg.unloadSvg('arrow-up-right');
    this.iconReg.unloadSvg('x');
  }
}
