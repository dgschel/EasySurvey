import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import { v4 as uuidv4 } from 'uuid';
import { SurveyModelSchema } from "../schemas/survey";

const cosmosOutput = output.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
    partitionKey: '/id',
});

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
            id: uuidv4(),
            models: parsedSurvey.data
        });

        return {
            jsonBody: {
                message: "Survey saved successfully",
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
    extraOutputs: [cosmosOutput],
    handler: saveSurveyToCosmosDbHttp
});
