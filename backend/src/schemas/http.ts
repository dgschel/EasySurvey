import { z } from "zod";
import { SurveyStatisticSchema } from "./statistic";

export const SurveyStatisticResponseSchema = SurveyStatisticSchema.extend({
  submission: z.record(z.string(), z.record(z.string(), z.number())),
});