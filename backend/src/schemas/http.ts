import { z } from "zod";
import { SurveyStatisticSchema } from "./statistic";

export const SubmissionCountSchema = z.record(z.string(), z.number());
export const SubmissionInputCountSchema = z.array(z.string());
export const SubmissionResponseSchema = z.union([SubmissionCountSchema, SubmissionInputCountSchema]);

export const SurveyStatisticResponseSchema = SurveyStatisticSchema.extend({
  submission: z.record(z.string(), SubmissionResponseSchema),
});