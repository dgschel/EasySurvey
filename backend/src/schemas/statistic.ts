import { z } from 'zod';

export const SubmissionStatisticSchema = z.object({
  startDate: z.coerce.date(), // valid dates are primitive date types form javascript => new Date(input) ISO-8601 format
  endDate: z.coerce.date(), // valid dates are primitive date types form javascript => new Date(input) ISO-8601 format
  status: z.enum(['success', 'failure']),
});

export const SurveyStatisticSchema = z.object({
  submissionTotalCount: z.number(),
  submissionSuccessCount: z.number(),
  submissionFailureCount: z.number(),
  submissionSuccessRate: z.number().transform((val) => Math.round(val)),
  submissionFailureRate: z.number().transform((val) => Math.round(val)),
  submissionAverageDurationInMS: z.number().transform((val) => Math.round(val)),
  submission: z.record(z.string(), SubmissionStatisticSchema), // Map of submissionId to Submission objects
});