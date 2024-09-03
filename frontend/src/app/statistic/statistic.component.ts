import { Component, OnInit } from '@angular/core';
import { SurveyStatisticDiagrammComponent } from './component/survey-statistic-diagramm/survey-statistic-diagramm.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { ChartOption } from './model/chart';
import { SubmissionCount, SubmissionCountResponse, SurveyStatisticResponse } from '../util/type/statistic';
import { isSubmissionCount } from '../util/guard/statistic-type';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [SurveyStatisticDiagrammComponent, JsonPipe],
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
      "Additional Feedback": [
        "",
        "Toller Coach!",
        "No answer",
        "New test",
        "Hello"
      ]
    }
  }

  generateChartOptions(submissionCount: Record<string, SubmissionCount>): Pick<ChartOption, 'chart' | 'series' | 'xaxis' | 'yaxis' | 'title' | 'plotOptions' | 'legend'>[] {
    return Object.keys(submissionCount).map((key) => {
      const submission = submissionCount[key];
      const submissionEntries = Object.entries(submission);
      const series = submissionEntries.map(([key, value]) => ({ name: key, data: [value] }));

      return {
        chart: {
          type: 'bar',
          height: 350,
        },
        series,
        xaxis: {
          categories: [key],
          labels: {
            show: false,
          }
        },
        yaxis: {
          show: false,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        title: {
          text: key
        },
        legend: {
          position: "right",
          offsetY: 60
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
