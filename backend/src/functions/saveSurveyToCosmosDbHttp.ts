import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import { v4 as uuidv4 } from 'uuid';
import { SurveyModelSchema } from "../schemas/survey";

const cosmosOutput = output.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
    partitionKey: '/id',
});

export async function saveSurveyToCosmosDbHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const survey = await request.json();

        if (!survey || !Array.isArray(survey) || survey.length === 0) {
            throw new Error("Survey data is empty or invalid");
        }

        const parsedSurvey = SurveyModelSchema.array().safeParse(survey);

        if (!parsedSurvey.success) {
            throw new Error("Survey data is invalid");
        }

        context.extraOutputs.set(cosmosOutput, {
            id: uuidv4(),
            models: parsedSurvey.data
        });

        return {
            jsonBody: {
                status: 200,
                message: "Survey saved successfully",
            }
        };

    } catch (error) {
        context.log(`Error:`, error);

        return {
            jsonBody: {
                message: error.message || "An unexpected error occurred",
            }
        };
    }
};

app.http('saveSurveyToCosmosDbHttp', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [cosmosOutput],
    handler: saveSurveyToCosmosDbHttp
});
