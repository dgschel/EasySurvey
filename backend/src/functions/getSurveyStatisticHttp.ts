import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";
import { SubmissionSchema } from "../schemas/submission";
import { SurveyStatisticSchema } from "../schemas/statistic";
import { SurveyStatisticResponseSchema } from "../schemas/http";
import { SurveyCosmosDbSchema, SurveyModelSchema } from "../schemas/survey";
import { summarizeSurveyStatistic } from "../util/statistic";
import { SubmissionInputCount } from "../models/http";

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
    partitionKey: '{surveyId}',
});

export async function getSurveyStatisticHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const surveys = context.extraInputs.get(surveyInput);
        const parsedSurvey = SurveyCosmosDbSchema.array().parse(surveys).at(0); // There should only be one survey since we are querying by id
        const models = SurveyModelSchema.array().parse(parsedSurvey.models); // Parse the survey models submission types ['radio', 'checkbox', ...]

        const surveyStatistic = context.extraInputs.get(blobInput);
        const submissions = context.extraInputs.get(submissionInput);

        const parsedSurveyStatistic = SurveyStatisticSchema.safeParse(surveyStatistic);
        const parsedSubmission = SubmissionSchema.pick({ submission: true, status: true }).array().safeParse(submissions);

        if (!parsedSurveyStatistic.success) {
            context.log(`Validation errors:`, parsedSurveyStatistic.error.errors);
            throw new Error("Survey statistic data is invalid");
        }

        if (!parsedSubmission.success) {
            context.log(`Validation errors:`, parsedSubmission.error.errors);
            throw new Error("Submission data is invalid");
        }

        // Summarize the submission
        const aggregatedSubmission = summarizeSurveyStatistic(parsedSubmission.data);

        // Map the input model to the aggregated submission
        const mapInputModel = models.reduce((acc, curr) => {
            if (curr.type === 'input') {
                return {
                    ...acc,
                    [curr.title]: Object.keys(aggregatedSubmission[curr.title])
                };
            }
            return acc;
        }, {} as SubmissionInputCount);


        // Merge the survey statistic data with the aggregated submission and input data
        const mergedStatistic = { ...parsedSurveyStatistic.data, submission: { ...aggregatedSubmission, ...mapInputModel } };

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
    authLevel: 'function',
    extraInputs: [blobInput, submissionInput, surveyInput],
    handler: getSurveyStatisticHttp
});