import { z } from "zod";
import { SubmissionCountSchema, SubmissionInputCountSchema, SubmissionResponseSchema, SurveyStatisticResponseSchema } from "../schemas/http";

export type SubmissionCount = z.infer<typeof SubmissionCountSchema>
export type SubmissionInputCount = z.infer<typeof SubmissionInputCountSchema>
export type SubmissionResponse = z.infer<typeof SubmissionResponseSchema>
export type SurveyStatisticResponse = z.infer<typeof SurveyStatisticResponseSchema>