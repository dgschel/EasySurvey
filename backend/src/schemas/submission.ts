import { z } from 'zod';
import { SubmissionStatisticSchema } from './statistic';

export const SurveySchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string())])
);

export const SubmissionSchema = z.object({
  submission: SurveySchema,
  id: z.string().uuid(),
  surveyId: z.string().uuid(),
  status: z.enum(["success", "failure"]),
  statistic: SubmissionStatisticSchema
});