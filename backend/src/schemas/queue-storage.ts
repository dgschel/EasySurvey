import { z } from 'zod';
import { SubmissionStatisticSchema } from './statistic';

export const SurveySubmissionMessageSchema = SubmissionStatisticSchema.extend({
  surveyId: z.string().uuid(),
  submissionId: z.string().uuid(),
})