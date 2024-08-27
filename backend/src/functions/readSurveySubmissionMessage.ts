import { app, input, InvocationContext, output } from "@azure/functions";
import { SubmissionStatistic, SurveyStatistic } from "../models/statistic";
import { SurveySubmissionMessage } from "../models/queue-storage";

const blobInput = input.storageBlob({
    path: 'statistic/{surveyId}.json', // {surveyId} is a key of the json from the parameter queueItem
    connection: 'storageConnection',
});

const blobOutput = output.storageBlob({
    path: 'statistic/{surveyId}.json',
    connection: 'storageConnection',
})

export async function readSurveySubmissionMessage(queueItem: SurveySubmissionMessage, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);

    const blob = context.extraInputs.get(blobInput);

    if (!blob) {
        // Create blob and save default content to it
        // it means that this was the first submission for this survey
        const defaultStatistic: SurveyStatistic = {
            submissionTotalCount: 1,
            submissionSuccessCount: queueItem.status === 'success' ? 1 : 0,
            submissionFailureCount: queueItem.status === 'failure' ? 1 : 0,
            submissionSuccessRate: queueItem.status === 'success' ? 1 : 0,
            submissionFailureRate: queueItem.status === 'failure' ? 1 : 0,
            submissionAverageDurationInMS: 0,
            submission: {
                [queueItem.submissionId]: {
                    date: queueItem.date,
                    status: queueItem.status
                }
            }
        }
        context.extraOutputs.set(blobOutput, defaultStatistic)
    } else {
        // Read blob and update it with the new submission
        const blob = context.extraInputs.get(blobInput) as SurveyStatistic;
        blob.submission[queueItem.submissionId] = {
            date: queueItem.date,
            status: queueItem.status
        };
        context.extraOutputs.set(blobOutput, blob)
    }
}

app.storageQueue('readSurveySubmissionMessage', {
    queueName: 'survey-submission-messages-001',
    connection: 'storageConnection',
    extraInputs: [blobInput],
    extraOutputs: [blobOutput],
    handler: readSurveySubmissionMessage
});
