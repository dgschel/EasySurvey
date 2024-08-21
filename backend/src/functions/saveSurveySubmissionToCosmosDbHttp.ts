import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";

const cosmosOutput = output.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Submission',
    connection: 'cosmosDbConnection',
    partitionKey: '/surveyId',
});

export async function saveSurveySubmissionToCosmosDbHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const submission: { survey: any, surveyId: string } = await request.json() as any;

        context.log(`Submission:`, submission);

        // Save the survey data to Cosmos DB
        context.extraOutputs.set(cosmosOutput, {
            id: context.invocationId, // Unique ID for the document
            surveyId: submission.surveyId, // Partition key is the survey
            submission: submission.survey
        });

        return { jsonBody: { message: `OK` } };

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

app.http('saveSurveySubmissionToCosmosDbHttp', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [cosmosOutput],
    handler: saveSurveySubmissionToCosmosDbHttp
});
