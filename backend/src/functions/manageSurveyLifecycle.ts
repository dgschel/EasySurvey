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

    try {
        // Get the survey with the surveyId
        const survey = context.extraInputs.get(surveyInput);

        // Try to parse the survey data
        const parsedSurveys = SurveyCosmosDbSchema.pick({ status: true }).array().safeParse(survey);

        // If the survey data is not valid, throw an error
        if (!parsedSurveys.success) {
            context.log(`Validation errors:`, parsedSurveys.error.errors);
            throw new Error("Survey data is invalid");
        }

        context.log("Survey data", parsedSurveys.data);
        
        // Prüfe und lösche nicht bezahlte Formulare, die älter als 7 Tage sind
    } catch (error) {
        context.log("An error occurred while processing the survey data", error);
    }
}

app.timer('ManageSurveyLifecycle', {
    schedule: '0 0 2 * * *',
    handler: manageSurveyLifecycle,
    extraInputs: [surveyInput]
});
