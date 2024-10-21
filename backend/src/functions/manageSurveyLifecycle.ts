import { app, input, InvocationContext, Timer } from "@azure/functions";
import { SurveyModel } from "../models/survey";
import { SurveyCosmosDbSchema } from "../schemas/survey";

const surveyInput = input.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
});

export async function manageSurveyLifecycle(myTimer: Timer, context: InvocationContext): Promise<void> {
    const timeStamp = new Date().toISOString();
    context.log('Timer function processed request at', timeStamp);
}

app.timer('ManageSurveyLifecycle', {
    schedule: '0 0 2 * * *',
    handler: manageSurveyLifecycle,
    extraInputs: [surveyInput]
});
