export type SubmissionStatistic = {
  startDate: Date;
  endDate: Date;
  status: 'success' | 'failure';
};

/**
 * Survey statistic data
 * @path backend\src\schemas\http.ts
 */
export type SurveyStatisticResponse = {
  submissionTotalCount: number;
  submissionSuccessCount: number;
  submissionFailureCount: number;
  submissionSuccessRate: number;
  submissionFailureRate: number;
  submissionAverageDurationInMS: number;
  submission: Record<string, Record<string, number> | string[]>
}