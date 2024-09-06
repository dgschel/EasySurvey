import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOption } from '../../model/chart';

@Component({
  selector: 'app-survey-statistic-diagramm',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './survey-statistic-diagramm.component.html',
  styleUrl: './survey-statistic-diagramm.component.scss'
})
export class SurveyStatisticDiagrammComponent implements AfterViewInit, OnDestroy {
  @ViewChild("chart") chart!: ElementRef<HTMLDivElement>;
  @Input() chartOption: Partial<ChartOption> = {}
  resizeSubscription: Subscription = new Subscription();

  ngAfterViewInit(): void {
    // Set the width of the chart to the width of the window minus the padding of the parent element
    // This is necessary because the chart does not automatically adjust its width when the window is resized
    // We need this code since if more than one chart is displayed, the automatic width adjustment does not work
    this.resizeSubscription = fromEvent(window, 'resize').pipe(debounceTime(500)).subscribe(() => {
      this.chart.nativeElement.style.width = window.innerWidth - 56 + 'px';
    });
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}
