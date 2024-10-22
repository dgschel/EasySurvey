import { app, InvocationContext, Timer } from "@azure/functions";

import {
  deleteSurveyAndRelatedSubmissions,
  getExpiredSurveyIds,
} from "../util/helper";

export async function manageSurveyLifecycle(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processed request at", new Date().toISOString());

  const secondsSinceEpoch = Math.floor(Date.now() / 1000);
  const expiredDocumentsQuery = buildExpiredDocumentsQuery(secondsSinceEpoch);

  try {
    const aadCredentials: TokenCredential = new DefaultAzureCredential();
    const endpoint = process.env.cosmosDbEndpoint;
    const client = new CosmosClient({ aadCredentials, endpoint });

    const container = client
      .database(process.env.COSMOS_DB_NAME)
      .container(process.env.COSMOS_DB_CONTAINER);

    context.log(
      `Connected to the database ${process.env.COSMOS_DB_NAME} and container ${process.env.COSMOS_DB_CONTAINER}`
    );

    context.log("Querying expired documents with query", expiredDocumentsQuery);

    const expiredSurveys: FeedResponse<SurveyCosmosDb> = await container.items
      .query(expiredDocumentsQuery)
      .fetchAll();

    context.log("Expired documents", expiredSurveys.resources);

  } catch (error) {
    context.log("An error occurred while connecting to the database", error);
  }
}

app.timer("manageSurveyLifecycle", {
  schedule: "0 0 2 * * *", // Run every day at 2:00 AM
  handler: manageSurveyLifecycle,
});
