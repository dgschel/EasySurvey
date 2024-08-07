import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";

const cosmosInput = input.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
    id: '{id}',
    partitionKey: '{id}',
});

export async function readSurveyFromCosmosDbHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        context.log(`Http function processed request for url "${request.url}"`);

        const survey = context.extraInputs.get(cosmosInput);

        if (!survey) {
            context.log('Survey not found');

            return {
                jsonBody: {
                    message: 'Survey not found',
                    data: []
                },
                status: 404
            }
        }

        context.log('Survey found:', survey['models']);

        return {

            jsonBody: {
                message: 'Survey found',
                data: survey['models'] || []
            },
            status: 200
        }
    } catch (error) {
        context.log(`Error:`, error);

        return {
            jsonBody: {
                message: 'Internal server error',
            },
            status: 500
        }
    }
};

app.http('readSurveyFromCosmosDbHttp', {
    methods: ['GET'],
    authLevel: 'function',
    extraInputs: [cosmosInput],
    handler: readSurveyFromCosmosDbHttp
});
