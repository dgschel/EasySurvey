import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";
import { SurveyCosmosDbSchema } from "../schemas/survey";

const surveyInput = input.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
    partitionKey: '{surveyId}',
});

export async function getSurveyPaymentStatusHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const surveyId = request.query.get('surveyId');

        // Check if there is a survey id
        if (!surveyId || surveyId === "") {
            context.log("Survey id is required");
            throw new Error("Survey id is required");
        }

        const surveys = context.extraInputs.get(surveyInput);

        // Check if there is a survey
        if (Array.isArray(surveys) && surveys.length === 0) {
            context.log(`Survey not found for id ${request.query.get('surveyId')}`);
            throw new Error(`Survey not found for id ${request.query.get('surveyId')}`);
        }

        // Validate the survey data using zod schema definition
        const parsedSurveys = SurveyCosmosDbSchema.array().safeParse(surveys)

        if (!parsedSurveys.success) {
            context.log(`Validation errors:`, parsedSurveys.error.errors);
            throw new Error("Survey data is invalid");
        }

        // Get the survey
        const survey = parsedSurveys.data.at(0);

        return {
            jsonBody: {
                message: `Survey payment status retrieved successfully`,
                data: { status: survey.status }
            }
        }

    } catch (error) {
        return {
            jsonBody: {
                message: `Failed to fetch Survey payment status`,
                error: error.message || "An unexpected error occurred"
            },
            status: 500
        };
    }
};

app.http('getSurveyPaymentStatusHttp', {
    methods: ['GET'],
    authLevel: 'function',
    extraInputs: [surveyInput],
    handler: getSurveyPaymentStatusHttp
});
