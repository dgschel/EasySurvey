import { InvocationContext } from "@azure/functions";
import { FeedResponse } from "@azure/cosmos";

import { getCosmosContainer } from "./cosmosdb";
import { SurveyCosmosDb } from "../models/survey";
import { buildExpiredDocumentsQuery } from "./query";

/**
 * Deletes a survey and its related submissions from the Cosmos DB.
 *
 * @param surveyId - The ID of the survey to be deleted.
 * @param context - The invocation context for logging and environment access.
 * @returns A promise that resolves when the operation is complete.
 *
 * @remarks
 * This function performs the following steps:
 * 1. Deletes the survey with the specified ID using a stored procedure.
 * 2. If the survey is successfully deleted, it proceeds to delete related submissions using another stored procedure.
 *
 * @throws Will log an error and return if the survey deletion fails.
 * @throws Will log an error if the deletion of related submissions fails.
 */
export async function deleteSurveyAndRelatedSubmissions(
  surveyId: string,
  context: InvocationContext
): Promise<void> {
  const surveyContainer = await getCosmosContainer(
    process.env.COSMOS_DB_NAME,
    process.env["COSMOS_DB_CONTAINER_SURVEY"],
    context
  );

  const submissionContainer = await getCosmosContainer(
    process.env.COSMOS_DB_NAME,
    process.env["COSMOS_DB_CONTAINER_SUBMISSION"],
    context
  );

  // Step 1: Delete the Survey
  let surveyDeleted: boolean;

  try {
    const { resource: surveyResult } = await surveyContainer.scripts
      .storedProcedure("deleteSurvey")
      .execute(surveyId, [surveyId]);

    // Check if survey was deleted successfully
    if (!surveyResult.surveyDeleted) {
      context.warn(
        `Survey with ID ${surveyId} not found or could not be deleted`
      );
      return;
    }

    surveyDeleted = surveyResult.surveyDeleted;
    context.log(`Survey with ID ${surveyId} successfully deleted`);
  } catch (error) {
    context.error("Failed to delete survey: ", error);
    return;
  }

  // Step 2: Delete Related Submissions if Survey Deletion was Successful
  if (surveyDeleted) {
    try {
      const { resource: submissionResult } = await submissionContainer.scripts
        .storedProcedure("bulkDelete")
        .execute(surveyId, [surveyId]);

      context.log(`Deleted submissions: ${submissionResult.deletedCount}`);
    } catch (error) {
      context.error("Failed to delete related submissions:", error);
    }
  }
}

/**
 * Retrieves the IDs of expired surveys from the Cosmos DB container.
 *
 * @param context - The invocation context which includes logging and other utilities.
 * @returns A promise that resolves to an array of expired survey IDs.
 *
 * @remarks
 * This function queries the Cosmos DB container for surveys that have expired based on the current time.
 * It logs the progress and any errors encountered during the execution.
 *
 * @throws Will return an empty array if the query fails.
 */
export async function getExpiredSurveyIds(
  context: InvocationContext
): Promise<string[]> {
  const surveyContainer = await getCosmosContainer(
    process.env.COSMOS_DB_NAME,
    process.env["COSMOS_DB_CONTAINER_SURVEY"],
    context
  );

  const secondsSinceEpoch = Math.floor(Date.now() / 1000);
  const expiredDocumentsQuery = buildExpiredDocumentsQuery(secondsSinceEpoch);

  try {
    context.log("Executing query to fetch expired surveys...");

    const { resources: results }: FeedResponse<SurveyCosmosDb> =
      await surveyContainer.items.query(expiredDocumentsQuery).fetchAll();

    const expiredSurveyIds = results.map((doc: { id: string }) => doc.id);

    context.log(
      `Query completed. Found ${expiredSurveyIds.length} expired surveys.`
    );

    return expiredSurveyIds;
  } catch (error) {
    context.error("Failed to fetch expired surveys:", error);
    return [];
  }
}
