import { z } from "zod";
import { SurveyCosmosDbSchema, SurveyModelSchema } from "../schemas/survey";

export type SurveyModel = z.infer<typeof SurveyModelSchema>;
export type SurveyCosmosDb = z.infer<typeof SurveyCosmosDbSchema>;
