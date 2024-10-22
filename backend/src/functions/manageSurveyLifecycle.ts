import { app, InvocationContext, Timer } from "@azure/functions";

import {
  deleteSurveyAndRelatedSubmissions,
  getExpiredSurveyIds,
} from "../util/helper";

export async function manageSurveyLifecycle(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer trigger function started");

  // Log timer information
  if (myTimer.isPastDue) {
    context.log("Timer is running late");
  }

  try {
    const expiredSurveyIds = await getExpiredSurveyIds(context);

    // Delete expired surveys and related submissions
    for (const surveyId of expiredSurveyIds) {
      await deleteSurveyAndRelatedSubmissions(surveyId, context);
    }
  } catch (error) {
    context.log("Error while querying expired documents:", error.message);
  }
}

app.timer("manageSurveyLifecycle", {
  schedule: "0 0 2 * * *", // Run every day at 2:00 AM
  handler: manageSurveyLifecycle,
});
