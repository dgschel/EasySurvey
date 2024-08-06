import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";

const cosmosInput = input.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
    id: '{id}',
    partitionKey: '{id}',
});

export async function readSurveyFromCosmosDbHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const survey = context.extraInputs.get(cosmosInput);

    if (!survey) {
        return { status: 404, body: 'Survey not found' };
    }

    return { status: 200, jsonBody: survey['models'] };
};

app.http('readSurveyFromCosmosDbHttp', {
    methods: ['GET'],
    authLevel: 'function',
    extraInputs: [cosmosInput],
    handler: readSurveyFromCosmosDbHttp
});
