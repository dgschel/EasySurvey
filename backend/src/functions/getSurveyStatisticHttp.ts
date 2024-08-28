import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";

const blobInput = input.storageBlob({
    path: 'statistic/{surveyId}.json', // {surveyId} is a key of the json from the parameter queueItem
    connection: 'storageConnection',
});

export async function getSurveyStatisticHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const blob = context.extraInputs.get(blobInput);

    context.log('Blob content:', blob);

    return {
        jsonBody: {
            message: `Statistic for survey ${request.params.surveyId}`,
            data: blob
        },
        status: 200
    };
};

app.http('getSurveyStatisticHttp', {
    methods: ['GET'],
    authLevel: 'function',
    extraInputs: [blobInput],
    handler: getSurveyStatisticHttp
});
