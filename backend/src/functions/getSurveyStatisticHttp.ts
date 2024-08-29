import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";
import { SurveyStatistic } from "../models/statistic";
import { Submission } from "../models/submission";
import { SubmissionSchema } from "../schemas/submission";
import { SurveyStatisticSchema } from "../schemas/statistic";
import { SurveyStatisticResponseSchema } from "../schemas/http";

const blobInput = input.storageBlob({
    path: 'statistic/{surveyId}.json', // {surveyId} is a key of the json from the parameter queueItem
    connection: 'storageConnection',
});

const cosmosInput = input.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Submission',
    connection: 'cosmosDbConnection',
    partitionKey: '{surveyId}',
});

export async function getSurveyStatisticHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const surveyStatistic = context.extraInputs.get(blobInput) as SurveyStatistic;
        const submissions = context.extraInputs.get(cosmosInput) as Submission[];

        const parsedSurveyStatistic = SurveyStatisticSchema.safeParse(surveyStatistic);
        const parsedSubmission = SubmissionSchema.pick({ id: true, submission: true, status: true }).array().safeParse(submissions);

        if (!parsedSurveyStatistic.success) {
            context.log(`Validation errors:`, parsedSurveyStatistic.error.errors);
            throw new Error("Survey statistic data is invalid");
        }

        if (!parsedSubmission.success) {
            context.log(`Validation errors:`, parsedSubmission.error.errors);
            throw new Error("Submission data is invalid");
        }

        // Map the submission data to the survey statistic
        const mappedStatistics = parsedSubmission.data.reduce((acc, curr) => {
            if (curr.id in parsedSurveyStatistic.data.submission) {
                return {
                    ...acc,
                    [curr.id]: {
                        submission: curr.submission,
                        status: curr.status
                    }
                };
            }

            return acc;
        }, {});

        // Merge the survey statistic data with the replaced submission data
        const mergedStatistic = {
            ...parsedSurveyStatistic.data,
            submission: mappedStatistics
        }

        // Validate the merged statistic data
        const parsedMergedStatistic = SurveyStatisticResponseSchema.safeParse(mergedStatistic)

        if (!parsedMergedStatistic.success) {
            context.log(`Validation errors:`, parsedMergedStatistic.error.errors);
            throw new Error("Merged statistic data is invalid");
        }

        return {
            jsonBody: {
                message: `Statistic for survey ${request.params.surveyId}`,
                data: parsedMergedStatistic.data
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
    extraInputs: [blobInput, cosmosInput],
    handler: getSurveyStatisticHttp
});
