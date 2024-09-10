import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import { SurveyModelSchema } from "../schemas/survey";

const cosmosOutput = output.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
    partitionKey: '/id',
});

const storageQueueOutput = output.storageQueue({
    queueName: 'survey-statistic-message-001',
    connection: 'storageConnection',
})

/**
 * Saves a survey to Cosmos DB using an HTTP request.
 * 
 * @param request - The HTTP request object.
 * @param context - The invocation context object.
 * @returns A promise that resolves to an HTTP response object.
 */
export async function saveSurveyToCosmosDbHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const survey = await request.json();

        // Check if there is a payload
        if (!survey || !Array.isArray(survey) || survey.length === 0) {
            throw new Error("Survey data is empty or invalid");
        }

        // Validate the survey data using zod schema definition
        const parsedSurvey = SurveyModelSchema.array().safeParse(survey);

        if (!parsedSurvey.success) {
            context.log(`Validation errors:`, parsedSurvey.error.errors);
            throw new Error("Survey data is invalid");
        }

        // Save the survey data to Cosmos DB
        context.extraOutputs.set(cosmosOutput, {
            id: context.invocationId, // Unique ID for the survey
            status: 'not paid',
            models: parsedSurvey.data
        });

        // Send a message to a storage queue to create a statistic file
        context.log(`Sending survey creation statistic message to the queue with survey ID: ${context.invocationId}`);
        context.extraOutputs.set(storageQueueOutput, { surveyId: context.invocationId });

        return {
            jsonBody: {
                message: "Survey saved successfully",
                data: { surveyId: context.invocationId }
            },
            status: 201
        };

    } catch (error) {
        context.log(`Error:`, error);

        return {
            jsonBody: {
                message: error.message || "An unexpected error occurred",
            },
            status: 500
        };
    }
};

app.http('saveSurveyToCosmosDbHttp', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [cosmosOutput, storageQueueOutput],
    handler: saveSurveyToCosmosDbHttp
});
