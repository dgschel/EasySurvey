import { Component } from '@angular/core';
import { SurveyStatisticDiagrammComponent } from './component/survey-statistic-diagramm/survey-statistic-diagramm.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { ChartOption } from './model/chart';
import { SurveyStatisticResponse } from '../util/type/statistic';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [SurveyStatisticDiagrammComponent],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.scss'
})
export class StatisticComponent {
  chartOption: Partial<ChartOption>[] = [];

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

  constructor(private http: HttpClient) {
    this.fetchSurveyStatistic();
  }

  fetchSurveyStatistic() {
    const url = environment.endpoints.getSurveyStatistic.replace('{surveyId}', '0bef9bc6-02cd-4da8-866d-2c08e721c2b2');
    return this.http.get(url).subscribe({ next: (response) => { console.log(response) }, error: (err) => console.log(err) });
  }
}