/**
 * Represents a submission of a survey.
 * @path backend\src\schemas\submission.ts
 */
export type Submission = {
  surveyFormData: Record<string, string | string[]>;
  surveyId: string;
};