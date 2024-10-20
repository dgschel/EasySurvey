import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { map, filter, switchMap, catchError, EMPTY, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import { HttpService } from '../../../../core/service/http.service';
import { SubNavigationService } from '../../../../core/service/sub-navigation.service';
import { DisplayErrorMessageComponent } from '../../../../shared/ui/display-error-message/display-error-message.component';
import { LoadingComponent } from '../../../../shared/ui/loading/loading.component';
import {
  isSubmissionCount,
  isSubmissionInputCount,
} from '../../../../util/guard/statistic-type';
import {
  convertMilisecondsToSecondOrMinutes,
  getDisplayUnit,
} from '../../../../util/helper/time';
import {
  SubmissionInputs,
  SubmissionCount,
  SubmissionCountResponse,
  SurveyStatisticResponse,
} from '../../../../util/type/statistic';
import { ChartListComponent } from './components/chart-list/chart-list.component';
import { DisplayStatisticComponent } from './components/display-statistic/display-statistic.component';
import { SurveyStatisticDiagrammComponent } from './components/survey-statistic-diagramm/survey-statistic-diagramm.component';
import { TableStatisticComponent } from './components/table-statistic/table-statistic.component';
import { StatisticalInfo } from './models/statistic';

@Component({
  selector: 'app-survey-statistic',
  standalone: true,
  imports: [
    RouterLink,
    SurveyStatisticDiagrammComponent,
    DisplayStatisticComponent,
    TableStatisticComponent,
    ChartListComponent,
    LoadingComponent,
    DisplayErrorMessageComponent,
  ],
  templateUrl: './survey-statistic.component.html',
  styleUrl: './survey-statistic.component.scss',
})
export class SurveyStatisticComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private httpService = inject(HttpService);
  private subNavigationService = inject(SubNavigationService);

  isLoading: boolean = true;
  errorMessage: string = '';
  surveyStatistics: StatisticalInfo[] = [];
  submissionInputs: Record<string, SubmissionInputs> = {};
  submissionCounts: Record<string, SubmissionCount> = {};

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        filter((params) => params.has('id')),
        map((params) => params.get('id') as string),
        tap((surveyId) => {
          this.subNavigationService.updateSubNavConfig({
            show: true,
            tabs: [
              { label: 'Fragen', route: `/survey/${surveyId}/view` },
              { label: 'Ergebnisse', route: `/survey/${surveyId}/statistic` },
            ],
          });
        }),
        switchMap((surveyId) =>
          this.fetchSurveyStatistic(surveyId).pipe(
            catchError((error: HttpErrorResponse) => {
              // Handle the from the server
              this.isLoading = false;
              this.errorMessage =
                'Fehler beim Laden der Statistikdaten. Bitte versuchen Sie es später erneut';
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          const { submission } = response.data;

          // Build the submission count table
          const filteredSubmissionCountKeys =
            this.filterSubmissionCounts(submission);
          this.submissionCounts = this.buildSubmission(
            submission,
            filteredSubmissionCountKeys,
          ) as Record<string, SubmissionCount>;

          // Build the statistic info
          this.surveyStatistics = this.extractStatistic(response.data);

          // Build the submission input table
          const filteredSubmissionInputsKeys =
            this.filterSubmissionInputs(submission);
          this.submissionInputs = this.buildSubmission(
            submission,
            filteredSubmissionInputsKeys,
          ) as Record<string, SubmissionInputs>;
        },
        error: (error) => {
          this.isLoading = false;
          // Handle error from the client
          this.errorMessage =
            'Fehler beim Laden der Statistikdaten. Bitte versuchen Sie es später erneut';
          console.error('error', error);
        },
      });
  }

  buildSubmission(
    submission: Record<string, SubmissionCountResponse>,
    keys: string[],
  ): Record<string, SubmissionCountResponse> {
    return keys.reduce((acc, key) => {
      return {
        ...acc,
        [key]: submission[key],
      };
    }, {});
  }

  extractStatistic(data: SurveyStatisticResponse): StatisticalInfo[] {
    return [
      {
        title: 'Einreichungen',
        value: data.submissionTotalCount,
        description: 'Gesamteinreichungen',
        icon: {
          name: 'arrow-up-right',
          class: 'text-primary',
        },
      },
      {
        title: 'Dauer',
        value: convertMilisecondsToSecondOrMinutes(
          data.submissionAverageDurationInMS,
        ),
        description: `Durchschnittsdauer in ${getDisplayUnit(data.submissionAverageDurationInMS)}`,
        icon: {
          name: 'stopwatch',
          class: 'text-secondary',
        },
      },
      {
        title: 'Erfolgreich',
        value: data.submissionSuccessCount,
        description: `${data.submissionSuccessRate}% Erfolgsrate`,
        icon: {
          name: 'check',
          class: 'text-success',
        },
      },
      {
        title: 'Fehlgeschlagen',
        value: data.submissionFailureCount,
        description: `${data.submissionFailureRate}% Fehlerrate`,
        icon: {
          name: 'x',
          class: 'text-error',
        },
      },
    ];
  }

  filterSubmissionCounts(
    submission: Record<string, SubmissionCountResponse>,
  ): string[] {
    return Object.keys(submission).filter((key) =>
      isSubmissionCount(submission[key]),
    );
  }

  filterSubmissionInputs(
    submission: Record<string, SubmissionCountResponse>,
  ): string[] {
    return Object.keys(submission).filter((key) =>
      isSubmissionInputCount(submission[key]),
    );
  }

  fetchSurveyStatistic(surveyId: string) {
    const url = environment.endpoints.getSurveyStatistic.replace(
      '{surveyId}',
      surveyId,
    );
    return this.httpService.get<SurveyStatisticResponse>(url);
  }

  ngOnDestroy() {
    this.subNavigationService.clearSubNavConfig();
  }
}
