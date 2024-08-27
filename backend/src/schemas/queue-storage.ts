import { z } from 'zod';

export const SurveySubmissionMessageSchema = z.object({
  surveyId: z.string().uuid(),
  submissionId: z.string().uuid(),
  date: z.string().datetime(), // ISO date string
  status: z.enum(['success', 'failure']),
});