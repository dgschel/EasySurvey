import { z } from "zod";
import { SubmissionSchema } from "../schemas/submission";

export type Submission = z.infer<typeof SubmissionSchema>;