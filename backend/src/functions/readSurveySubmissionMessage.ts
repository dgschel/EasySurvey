import { app, input, InvocationContext, output } from "@azure/functions";
import { SurveyStatistic } from "../models/statistic";
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

    // Read blob and update it with the new submission
    const blob = context.extraInputs.get(blobInput) as SurveyStatistic;
    const updatedBlob = updateStatistic(blob, queueItem);

    context.extraOutputs.set(blobOutput, updatedBlob);
}

const updateStatistic = (statistic: SurveyStatistic, submission: SurveySubmissionMessage): SurveyStatistic => {
    statistic.submissionTotalCount += 1;

    // Update success or failure count based on the status of the new submission
    if (submission.status === 'success') {
        statistic.submissionSuccessCount += 1;
    } else {
        statistic.submissionFailureCount += 1;
    }

    // Recalculate success and failure rates
    statistic.submissionSuccessRate =
        (statistic.submissionSuccessCount / statistic.submissionTotalCount) * 100;
    statistic.submissionFailureRate =
        (statistic.submissionFailureCount / statistic.submissionTotalCount) * 100;

    // Add the new submission to the submission map
    statistic.submission[submission.submissionId] = { date: submission.date, status: submission.status };

    return statistic;
};

app.storageQueue('readSurveySubmissionMessage', {
    queueName: 'survey-submission-messages-001',
    connection: 'storageConnection',
    extraInputs: [blobInput],
    extraOutputs: [blobOutput],
    handler: readSurveySubmissionMessage
});