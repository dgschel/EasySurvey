import { z } from "zod";
import { SubmissionStatisticSchema, SurveyStatisticSchema } from "../schemas/statistic";

export type SubmissionStatistic = z.infer<typeof SubmissionStatisticSchema>;
export type SurveyStatistic = z.infer<typeof SurveyStatisticSchema>;