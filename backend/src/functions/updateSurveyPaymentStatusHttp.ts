import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";

const surveyInput = input.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
    partitionKey: '{surveyId}',
});

export async function updateSurveyPaymentStatusHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name}!` };
};

app.http('updateSurveyPaymentStatusHttp', {
    methods: ['PUT'],
    route: 'survey/{surveyId}/payment-status',
    authLevel: 'function',
    extraInputs: [surveyInput],
    handler: updateSurveyPaymentStatusHttp
});
