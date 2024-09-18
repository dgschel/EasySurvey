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

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name}!` };
};

app.http('updateSurveyPaymentStatusHttp', {
    methods: ['PUT'],
    route: 'survey/{surveyId}/payment-status',
    authLevel: 'function',
    extraInputs: [surveyInput],
    extraOutputs: [surveyOutput],
    handler: updateSurveyPaymentStatusHttp
});
