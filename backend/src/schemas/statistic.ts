import { z } from 'zod';

export const SubmissionStatisticSchema = z.object({
  date: z.string().datetime(), // ISO date string
  status: z.enum(['success', 'failure']),
});

export const SurveyStatisticSchema = z.object({
  submissionTotalCount: z.number(),
  submissionSuccessCount: z.number(),
  submissionFailureCount: z.number(),
  submissionSuccessRate: z.number(),
  submissionFailureRate: z.number(),
  submissionAverageDurationInMS: z.number(),
  submission: z.record(z.string(), SubmissionStatisticSchema), // Map of submissionId to Submission objects
});