import { Component, Input, OnInit } from '@angular/core';
import { ChartModel, ChartOption } from '../../model/chart';
import { BasicCardComponent } from '../../../shared/ui/basic-card/basic-card.component';
import { SurveyStatisticDiagrammComponent } from '../survey-statistic-diagramm/survey-statistic-diagramm.component';
import { SubmissionCountResponse, SubmissionCount } from '../../../util/type/statistic';
import { isSubmissionCount } from '../../../util/guard/statistic-type';

@Component({
  selector: 'app-chart-list',
  standalone: true,
  imports: [BasicCardComponent, SurveyStatisticDiagrammComponent],
  templateUrl: './chart-list.component.html',
  styleUrl: './chart-list.component.scss'
})
export class ChartListComponent implements OnInit {
  @Input() submission: Record<string, SubmissionCount> = {};
  chartList: ChartModel[] = [];

  ngOnInit(): void {
    const charts = this.generateChart(this.submission);
    this.chartList.push(...charts);
  }

  get hasSubmission(): boolean {
    return Object.keys(this.submission).length > 0;
  }

  generateChart(submissionCount: Record<string, SubmissionCount>): ChartModel[] {
    return Object.keys(submissionCount).map((key) => {
      const submission = submissionCount[key];
      const series = this.buildSeries(submission);
      const height = this.calculateChartHeight(series.length) || 250;

      return {
        title: key,
        config: this.buildChartConfig(key, series, height)
      }
    })
  }

  private buildSeries(submission: SubmissionCount): { name: string, data: number[] }[] {
    return Object.entries(submission).map(([key, value]) => ({ name: key, data: [value] }));
  }

  private buildChartConfig(key: string, series: { name: string, data: number[] }[], height: number): Partial<ChartOption> {
    return {
      chart: {
        type: 'bar',
        height,
        parentHeightOffset: 0,
        fontFamily: 'inherit',
        toolbar: {
          offsetX: -8,
          offsetY: 8,
          export: {
            csv: {
              filename: key,
              headerCategory: "Antwort",
            },
            svg: {
              filename: key
            },
            png: {
              filename: key
            }
          }
        }
      },
      series,
      colors: ["#39B97B", "#51CC91", "#E3857F", "#DB5F57", "#ECD69C"],
      grid: {
        show: false,
        padding: {
          left: 0,
          top: 0,
        },
      },
      xaxis: {
        axisBorder: { show: false },
        categories: [key],
        max: this.getMaximumValue(series) + 1, // Add 1 to the maximum value to make the chart more readable
        stepSize: 1,
        labels: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      responsive: [
        {
          breakpoint: 767, // Chart will be responsive on mobile devices
          options: {
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            tooltip: {
              x: {
                show: false
              },
            },
            legend: {
              position: "bottom",
              offsetY: 0
            }
          }
        }
      ],
      tooltip: {
        x: {
          show: true,
        },
        followCursor: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '40px',
          columnWidth: '40px',
        }
      },
      title: {
        text: key,
        style: {
          fontFamily: 'inherit',
          fontSize: '20px',
          fontWeight: '600',
        },
        margin: 5,
      },
      stroke: {
        colors: ['transparent'],
        width: 5
      },
      legend: {
        position: "right",
        fontFamily: 'inherit',
      }
    };
  }

  private calculateChartHeight(length: number): number {
    return (length * 40) + 64 // 40px for each series (bar width and height) and 64px for the title
  }

  private getMaximumValue(series: { name: string, data: number[] }[]): number {
    return series.reduce((acc, { data }) => {
      return Math.max(acc, data[0]);
    }, 0)
  }
}
