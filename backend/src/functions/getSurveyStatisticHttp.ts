import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";

const blobInput = input.storageBlob({
    path: 'statistic/{surveyId}.json', // {surveyId} is a key of the json from the parameter queueItem
    connection: 'storageConnection',
});

const cosmosInput = input.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Submission',
    connection: 'cosmosDbConnection',
    partitionKey: '{surveyId}',
});

export async function getSurveyStatisticHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const surveyStatistic = context.extraInputs.get(blobInput);
    const submissions = context.extraInputs.get(cosmosInput);

    context.log('Blob content:', surveyStatistic);
    context.log('Cosmos content:', submissions);

    return {
        jsonBody: {
            message: `Statistic for survey ${request.params.surveyId}`,
            data: {
                [request.params.surveyId]: surveyStatistic,
                submissions
            }
        },
        status: 200
    };
};

app.http('getSurveyStatisticHttp', {
    methods: ['GET'],
    authLevel: 'function',
    extraInputs: [blobInput, cosmosInput],
    handler: getSurveyStatisticHttp
});
