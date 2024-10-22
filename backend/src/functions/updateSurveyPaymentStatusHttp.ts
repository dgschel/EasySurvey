import { app, HttpRequest, HttpResponseInit, input, InvocationContext, output } from "@azure/functions";
import { SurveyCosmosDbSchema } from "../schemas/survey";

const surveyInput = input.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
    id: '{surveyId}', // Use both parameter to fetch a single survey as per documentation
    partitionKey: '{surveyId}',
});

const surveyOutput = output.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
});

export async function updateSurveyPaymentStatusHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        // Get the survey with the surveyId
        const survey = context.extraInputs.get(surveyInput);

        // Check if there is a survey
        if (survey === undefined || survey === null || typeof survey !== 'object') {
            context.log(`Survey not found for id ${request.params.surveyId}`);
            throw new Error(`Survey not found for id ${request.params.surveyId}`);
        }

        // Try to parse the survey data
        const parsedSurvey = SurveyCosmosDbSchema.safeParse(survey);

        // Validate the survey data using zod schema definition
        if (!parsedSurvey.success) {
            context.log(`Validation errors:`, parsedSurvey.error.errors);
            throw new Error("Survey data is invalid");
        }

        // Update the survey payment status if it is not paid to prevent modification on the document
        // We need to check that because of the mechanism to automatically delete documents after a certain time
        if (parsedSurvey.data.status === 'not paid') {
            context.log(`Updating survey payment status to "paid" for survey with id ${request.params.surveyId}`);
            context.extraOutputs.set(surveyOutput, { ...parsedSurvey.data, status: 'paid' });
        }

        return {
            jsonBody: {
                message: `Survey payment status updated successfully`,
            },
            status: 200 // Return 200 status code for updated ressource
        }

    } catch (error) {
        return {
            jsonBody: {
                message: `Failed to update Survey payment status`,
                error: error.message || "An unexpected error occurred"
            },
            status: 500
        };
    }
};

app.http('updateSurveyPaymentStatusHttp', {
    methods: ['PUT'],
    route: 'survey/{surveyId}/payment-status',
    authLevel: 'function',
    extraInputs: [surveyInput],
    extraOutputs: [surveyOutput],
    handler: updateSurveyPaymentStatusHttp
});
