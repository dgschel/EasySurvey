import { z } from 'zod';

export const SurveySchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string())])
);

export const SubmissionSchema = z.object({
  surveyFormData: SurveySchema,
  surveyId: z.string().uuid(),
});