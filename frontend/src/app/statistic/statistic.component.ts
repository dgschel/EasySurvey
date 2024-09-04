import { Component, OnInit } from '@angular/core';
import { SurveyStatisticDiagrammComponent } from './component/survey-statistic-diagramm/survey-statistic-diagramm.component';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.development';
import { SubmissionCount, SubmissionCountResponse, SurveyStatisticResponse } from '../util/type/statistic';
import { isSubmissionCount } from '../util/guard/statistic-type';
import { BasicCardComponent } from '../shared/ui/basic-card/basic-card.component';
import { ChartModel, ChartOption } from './model/chart';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [SurveyStatisticDiagrammComponent, BasicCardComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent implements OnInit {
  chartList: ChartModel[] = [];

  data: SurveyStatisticResponse = {
    "submissionTotalCount": 16,
    "submissionSuccessCount": 13,
    "submissionFailureCount": 3,
    "submissionSuccessRate": 81,
    "submissionFailureRate": 19,
    "submissionAverageDurationInMS": 14314,
    "submission": {
      "The expert who responded to my question was knowledgable": {
        "Strongly Agree": 4,
        "No answer": 2,
        "": 1,
        "Disagree": 1,
        "Agree": 5,
        "Strongly Disagree": 1,
        "Don't know": 1
      },
      "Overall, my expectations were:": {
        "Exceed": 1,
        "Met": 1,
        "No answer": 1
      },
      "I took an action or will take an action soon based on the information shared by the expert": {
        "Strongly Agree": 1,
        "Agree": 2,
        "Disagree": 1
      },
    }
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
        }
      },
      series,
      colors: ["#b30000", "#7c1158", "#4421af", "#1a53ff", "#0d88e6", "#00b7c7", "#5ad45a", "#8be04e", "#ebdc78", "#ff9e00"],
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
        labels: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      responsive: [
        {
          breakpoint: 767,
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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const { submission } = this.data;

    const filteredSubmissionCountKeys = this.filterSubmissionCounts(submission);
    const submissionStatistics = this.buildSubmissionCounts(submission, filteredSubmissionCountKeys);

    // Use the static data to generate the chart options
    const charts = this.generateChart(submissionStatistics)
    this.chartList.push(...charts);
  }

  private filterSubmissionCounts(submission: Record<string, SubmissionCountResponse>): string[] {
    return Object.keys(submission).filter((key) => isSubmissionCount(this.data.submission[key]))
  }

  private buildSubmissionCounts(submission: Record<string, SubmissionCountResponse>, keys: string[]): Record<string, SubmissionCount> {
    return keys.reduce((acc, key) => {
      return {
        ...acc,
        [key]: submission[key]
      }
    }, {})
  }

  fetchSurveyStatistic() {
    const url = environment.endpoints.getSurveyStatistic.replace('{surveyId}', '0bef9bc6-02cd-4da8-866d-2c08e721c2b2');
    return this.http.get(url).subscribe({ next: (response) => { console.log(response) }, error: (err) => console.log(err) });
  }
}
