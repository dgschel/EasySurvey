import { Component, OnInit } from '@angular/core';
import { SurveyStatisticDiagrammComponent } from './component/survey-statistic-diagramm/survey-statistic-diagramm.component';
import { HttpClient } from '@angular/common/http';

import { ChartOption } from './model/chart';
import { environment } from '../../environments/environment.development';
import { SubmissionCount, SubmissionCountResponse, SurveyStatisticResponse } from '../util/type/statistic';
import { isSubmissionCount } from '../util/guard/statistic-type';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [SurveyStatisticDiagrammComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent implements OnInit {
  chartOptions: Partial<ChartOption>[] = [];

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
      "I took an action or will take an action soon based on the information shared by the expert": {
        "Strongly Agree": 1,
        "Agree": 2,
        "Disagree": 1
      },
      "Overall, my expectations were:": {
        "Exceed": 1,
        "Met": 1,
        "No answer": 1
      },
      "Additional Feedback": [
        "",
        "Toller Coach!",
        "No answer",
        "New test",
        "Hello"
      ]
    }
  }

  generateChartOptions(submissionCount: Record<string, SubmissionCount>): Pick<ChartOption, 'chart' | 'series' | 'grid' | 'xaxis' | 'yaxis' | 'tooltip' | 'title' | 'plotOptions' | 'legend'>[] {
    return Object.keys(submissionCount).map((key) => {
      const submission = submissionCount[key];
      const submissionEntries = Object.entries(submission);
      const series = submissionEntries.map(([key, value]) => ({ name: key, data: [value] }));

      return {
        chart: {
          type: 'bar',
          height: 400, // TODO: calcuate the height based on the number of series
          parentHeightOffset: 0
        },
        series,
        grid: {
          show: false,
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
          text: key, // TODO: if possible then break into multiple lines
        },
        stroke: {
          colors: ['transparent'],
          width: 5
        },
        legend: {
          position: "right"
        }
      }
    })
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const { submission } = this.data;

    const filteredSubmissionCountKeys = this.filterSubmissionCounts(submission);
    const submissionStatistics = this.buildSubmissionCounts(submission, filteredSubmissionCountKeys);

    // Use the static data to generate the chart options
    this.chartOptions = this.generateChartOptions(submissionStatistics);
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
