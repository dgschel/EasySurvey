import { app, HttpRequest, HttpResponseInit, input, InvocationContext } from "@azure/functions";
import { SubmissionSchema } from "../schemas/submission";
import { SurveyStatisticSchema } from "../schemas/statistic";
import { SurveyResponse, SurveyStatisticResponseSchema } from "../schemas/http";
import { SurveyCosmosDbSchema, SurveyModelSchema } from "../schemas/survey";

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
        const models = SurveyModelSchema.array().parse(parsedSurvey.models);

        const surveyStatistic = context.extraInputs.get(blobInput);
        const submissions = context.extraInputs.get(submissionInput);

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

            // Check if the submission id is in the survey statistic
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


        // Count the number of submissions for each question and answer
        const result = parsedSubmission.data.reduce((acc, curr) => {
            const submission = curr.submission;

            for (const question in submission) {
                const answer = submission[question];

                // Initialize the question entry if not already initialized
                if (!acc[question]) {
                    acc[question] = {}
                }

                // If the answer is an array, increment the count for each answer
                if (Array.isArray(answer)) {

                    answer.forEach((value) => {
                        if (!acc[question][value]) {
                            acc[question][value] = 0
                        }

                        // Increment the count for this answer
                        acc[question][value] += 1
                    })
                }

                else {
                    // Initialize the answer count if not already initialized
                    if (!acc[question][answer]) {
                        acc[question][answer] = 0
                    }

                    // Increment the count for this answer
                    acc[question][answer] += 1
                }
            }

            return acc
        }, {})

        context.log("result", result)

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
                data: {
                    survey: parsedSurvey,
                    submission: parsedSubmission.data,
                    statistic: parsedSurveyStatistic.data
                }
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
