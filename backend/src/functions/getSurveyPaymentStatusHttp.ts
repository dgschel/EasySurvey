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
        const payload = await request.json();

        // Validate the payload
        const parsedPayload = SurveyCosmosDbSchema.pick({ id: true }).safeParse(payload);

        if (!parsedPayload.success) {
            context.log("Validation Error", parsedPayload.error.errors);
            throw new Error("Payload is invalid");
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
