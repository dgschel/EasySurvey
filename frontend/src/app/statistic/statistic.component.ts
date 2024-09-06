import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

import { SurveyStatisticDiagrammComponent } from './component/survey-statistic-diagramm/survey-statistic-diagramm.component';
import { SubmissionCount, SubmissionInputCount, SubmissionCountResponse, SurveyStatisticResponse } from '../util/type/statistic';
import { isSubmissionCount, isSubmissionInputCount } from '../util/guard/statistic-type';
import { BasicCardComponent } from '../shared/ui/basic-card/basic-card.component';
import { DisplayStatisticComponent } from './component/display-statistic/display-statistic.component';
import { ChartModel, ChartOption } from './model/chart';
import { StatisticalInfo } from './model/statistic';
import { convertMilisecondsToSecondOrMinutes, getDisplayUnit } from '../util/helper/time';
import { TableStatisticComponent } from "./component/table-statistic/table-statistic.component";

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [SurveyStatisticDiagrammComponent, DisplayStatisticComponent, BasicCardComponent, TableStatisticComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent implements OnInit {
  chartList: ChartModel[] = [];
  surveyStatistics: StatisticalInfo[] = [];
  submissionTable: Record<string, SubmissionInputCount> = {};

  data: SurveyStatisticResponse = {
    "submissionTotalCount": 16,
    "submissionSuccessCount": 13,
    "submissionFailureCount": 3,
    "submissionSuccessRate": 81,
    "submissionFailureRate": 19,
    "submissionAverageDurationInMS": 412393,
    "submission": {
      "The expert who responded to my question was knowledgable": {
        "Strongly Agree": 4,
        "No answer": 2,
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
      "Additional Feedback": [
        "Toller Coach!",
        "No answer",
        "New test",
        "Hello"
      ],
      "What would you do if the expert did not qualified to be as an expert?": [
        "Amazing!",
      ]
    }
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const { submission } = this.data;

    const filteredSubmissionCountKeys = this.filterSubmissionCounts(submission);
    const submissionStatistics = this.buildSubmissionCounts(submission, filteredSubmissionCountKeys);

    // Use the static data to generate the chart options
    const charts = this.generateChart(submissionStatistics)
    this.chartList.push(...charts);

    // Use the static data to generate the statistic information
    this.surveyStatistics = this.extractStatistic(this.data);

    // Use the static data to generate the user input information
    const filteredSubmissionInputsKeys = this.filterInputSubmission(submission);
    this.submissionTable = this.buildSubmissionTable(submission, filteredSubmissionInputsKeys);
  }

  buildSubmissionTable(submission: Record<string, SubmissionCountResponse>, keys: string[]): Record<string, SubmissionInputCount> {
    return keys.reduce((acc, key) => {
      return {
        ...acc,
        [key]: submission[key]
      }
    }, {})
  }

  extractStatistic(data: SurveyStatisticResponse): StatisticalInfo[] {
    return [{
      title: 'Einreichungen',
      value: data.submissionTotalCount,
      description: 'Gesamteinreichungen',
      icon: {
        name: 'arrow-up-right',
        class: 'text-primary',
      }
    },
    {
      title: 'Dauer',
      value: convertMilisecondsToSecondOrMinutes(data.submissionAverageDurationInMS),
      description: `Durchschnittsdauer in ${getDisplayUnit(data.submissionAverageDurationInMS)}`,
      icon: {
        name: 'stopwatch',
        class: 'text-secondary'
      }
    },
    {
      title: 'Erfolgreich',
      value: data.submissionSuccessCount,
      description: `${data.submissionSuccessRate}% Erfolgsrate`,
      icon: {
        name: 'check',
        class: 'text-success'
      }
    },
    {
      title: 'Fehlgeschlagen',
      value: data.submissionFailureCount,
      description: `${data.submissionFailureRate}% Fehlerrate`,
      icon: {
        name: 'x',
        class: 'text-error'
      }
    }]
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

  private filterSubmissionCounts(submission: Record<string, SubmissionCountResponse>): string[] {
    return Object.keys(submission).filter((key) => isSubmissionCount(this.data.submission[key]))
  }

  private filterInputSubmission(submission: Record<string, SubmissionCountResponse>): string[] {
    return Object.keys(submission).filter((key) => isSubmissionInputCount(submission[key]))
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
