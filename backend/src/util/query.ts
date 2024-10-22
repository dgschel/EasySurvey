import { SqlQuerySpec } from "@azure/cosmos";

export const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

// https://learn.microsoft.com/de-de/azure/cosmos-db/nosql/quickstart-nodejs?tabs=typescript&pivots=devcontainer-vscode
export const buildExpiredDocumentsQuery = (
  currentUnixTimeInSeconds: number
): SqlQuerySpec => {
  return {
    query: `SELECT * FROM s WHERE s._ts < @expiryDate`,
    parameters: [
      {
        name: "@expiryDate",
        value: Math.floor(currentUnixTimeInSeconds) - SEVEN_DAYS_IN_SECONDS, // Convert to seconds and subtract x days
      },
    ],
  };
};
