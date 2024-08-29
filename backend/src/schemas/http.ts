import { z } from "zod";
import { SurveyStatisticSchema } from "./statistic";
import { SurveySchema } from "./submission";

export const SurveyStatisticResponseSchema = SurveyStatisticSchema.extend({
  submission: z.record(z.string(), z.object({ submission: SurveySchema, status: z.enum(["success", "failure"]) }))
});