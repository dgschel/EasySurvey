import { z } from "zod";
import { SurveyCosmosDbSchema, SurveyModelSchema, SurveyStatisticSummarySchema } from "../schemas/survey";

export type SurveyModel = z.infer<typeof SurveyModelSchema>;
export type SurveyCosmosDb = z.infer<typeof SurveyCosmosDbSchema>;
export type SurveyStatisticSummary = z.infer<typeof SurveyStatisticSummarySchema>;