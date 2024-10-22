import { Container, CosmosClient } from "@azure/cosmos";
import { InvocationContext } from "@azure/functions";
import { TokenCredential, DefaultAzureCredential } from "@azure/identity";

/**
 * Helper function to retrieve a Cosmos DB container.
 * @param databaseName - Name of the Cosmos DB database.
 * @param containerName - Name of the container to access.
 * @returns {Container} - Cosmos DB Container instance.
 * @throws Error if connection fails.
 */
export async function getCosmosContainer(
  databaseName: string,
  containerName: string,
  context: InvocationContext
): Promise<Container> {
  const aadCredentials: TokenCredential = new DefaultAzureCredential();
  const endpoint = process.env["cosmosDbEndpoint"];

  if (!endpoint) {
    throw new Error(
      "Cosmos DB endpoint is not configured in environment variables."
    );
  }

  const client = new CosmosClient({ aadCredentials, endpoint });

  try {
    const container = client.database(databaseName).container(containerName);
    context.log(
      `Successfully retrieved container: ${containerName} in database: ${databaseName}`
    );
    return container;
  } catch (error) {
    context.error(
      `Failed to connect to Cosmos DB container: ${containerName} in database: ${databaseName}`,
      error
    );
    throw error;
  }
}
