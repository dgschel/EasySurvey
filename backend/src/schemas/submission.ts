import { z } from 'zod';

const surveySchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string())])
);

const submissionSchema = z.object({
  surveyFormData: surveySchema,
  surveyId: z.string().uuid(),
});