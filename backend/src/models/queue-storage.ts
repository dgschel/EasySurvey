import { z } from "zod";
import { SurveySubmissionMessageSchema } from "../schemas/queue-storage";

export type SurveySubmissionMessage = z.infer<typeof SurveySubmissionMessageSchema>;
