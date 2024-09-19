import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";
import { SubmissionSchema } from "../schemas/submission";
import { SurveyStatisticSchema } from "../schemas/statistic";
import { SurveyStatisticResponseSchema } from "../schemas/http";
import { SurveyCosmosDbSchema, SurveyModelSchema } from "../schemas/survey";
import { mapInputModelToSubmission, summarizeSurveyStatistic } from "../util/statistic";

const blobInput = input.storageBlob({
    path: 'statistic/{surveyId}.json', // {surveyId} is a key of the json from the parameter queueItem
    connection: 'storageConnection',
});

const submissionInput = input.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Submission',
    connection: 'cosmosDbConnection',
    partitionKey: '{surveyId}',
});

const surveyInput = input.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Survey',
    connection: 'cosmosDbConnection',
    id: '{surveyId}', // Use both parameter to fetch a single survey as per documentation
    partitionKey: '{surveyId}',
});

export async function getSurveyStatisticHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        // Get the survey with the surveyId
        const survey = context.extraInputs.get(surveyInput);

        // Check if there is a survey
        if (survey === undefined || survey === null || typeof survey !== 'object') {
            context.log(`Survey not found for id ${request.params.surveyId}`);
            throw new Error(`Survey not found for id ${request.params.surveyId}`);
        }

        // Try to parse the survey data
        const parsedSurvey = SurveyCosmosDbSchema.parse(survey);
        const models = SurveyModelSchema.array().parse(parsedSurvey.models); // Parse the survey models submission types ['radio', 'checkbox', ...]

        // Get the survey statistic and submissions
        const surveyStatistic = context.extraInputs.get(blobInput);
        const submissions = context.extraInputs.get(submissionInput);

        // Validate the survey statistic and submission data
        const parsedSurveyStatistic = SurveyStatisticSchema.safeParse(surveyStatistic);
        const parsedSubmission = SubmissionSchema.pick({ submission: true }).array().safeParse(submissions);

        // Check if the data is valid
        if (!parsedSurveyStatistic.success) {
            context.log(`Validation errors:`, parsedSurveyStatistic.error.errors);
            throw new Error("Survey statistic data is invalid");
        }

        // Check if the data is valid
        if (!parsedSubmission.success) {
            context.log(`Validation errors:`, parsedSubmission.error.errors);
            throw new Error("Submission data is invalid");
        }

        // Summarize the submission
        const surveyStatisticSummary = summarizeSurveyStatistic(parsedSubmission.data);

        // Map the input model to the aggregated submission
        const mapInputModel = mapInputModelToSubmission(models, surveyStatisticSummary);

        // Merge the survey statistic data with the aggregated submission and input data
        const mergedStatistic = { ...parsedSurveyStatistic.data, submission: { ...surveyStatisticSummary, ...mapInputModel } };

        // Validate the summarized statistic data
        const statistic = SurveyStatisticResponseSchema.safeParse(mergedStatistic);

        if (!statistic.success) {
            context.log(`Validation errors:`, statistic.error.errors);
            throw new Error("Summarized survey statistic data is invalid");
        }

        return {
            jsonBody: {
                message: `Statistic for survey ${request.params.surveyId}`,
                data: statistic.data
            },
            status: 200
        };
    } catch (error) {

        return {
            jsonBody: {
                message: error.message || "An unexpected error occurred",
            },
            status: 500
        };
    }
};

app.http('getSurveyStatisticHttp', {
    methods: ['GET'],
    route: 'survey/{surveyId}/statistic', // Semantic API route
    authLevel: 'function',
    extraInputs: [blobInput, submissionInput, surveyInput],
    handler: getSurveyStatisticHttp
});