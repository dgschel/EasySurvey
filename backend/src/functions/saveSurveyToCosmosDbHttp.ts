import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import { v4 as uuidv4 } from 'uuid';
import { SurveyModel } from "../models/survey";

const cosmosOutput = output.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
    partitionKey: '/id',
});

export async function saveSurveyToCosmosDbHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const survey = await request.json() as SurveyModel[];

        if (survey) {
            context.extraOutputs.set(cosmosOutput, {
                id: uuidv4(),
                models: survey['models'],
            })
        }

        return {
            body: "Survey saved successfully",
        }

    } catch (error) {
        context.log(`Error: ${error}`);
        return {
            status: 500,
            body: "An error occurred while saving the survey",
        }

    }
};

app.http('saveSurveyToCosmosDbHttp', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [cosmosOutput],
    handler: saveSurveyToCosmosDbHttp
});
