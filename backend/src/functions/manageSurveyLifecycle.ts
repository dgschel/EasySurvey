import { app, input, InvocationContext, Timer } from "@azure/functions";
import { SurveyCosmosDbSchema } from "../schemas/survey";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

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
        const parsedSurveys = SurveyCosmosDbSchema.pick({ status: true, _ts: true }).array().safeParse(survey);

        // If the survey data is not valid, throw an error
        if (!parsedSurveys.success) {
            context.log(`Validation errors:`, parsedSurveys.error.errors);
            throw new Error("Survey data is invalid");
        }

        context.log("Survey data", parsedSurveys.data);

        const isOlder = isDocumentExpired(parsedSurveys.data[parsedSurveys.data.length - 1]._ts);
        // Prüfe und lösche nicht bezahlte Formulare, die älter als 7 Tage sind
    } catch (error) {
        context.log("An error occurred while processing the survey data", error);
    }
}

function isDocumentExpired(ts: number): boolean {
    // convert the timestamp to a date
    const documentDate = new Date(ts * 1000);

    // subtract from the current date to determine if the document is older than x days
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS);

    return documentDate < sevenDaysAgo;
}

app.timer('ManageSurveyLifecycle', {
    schedule: '0 0 2 * * *',
    handler: manageSurveyLifecycle,
    extraInputs: [surveyInput]
});
