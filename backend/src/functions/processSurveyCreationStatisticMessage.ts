import { app, InvocationContext, output } from "@azure/functions";
import { SurveyStatistic } from "../models/statistic";

const blobOutput = output.storageBlob({
    path: 'statistic/{surveyId}.json',
    connection: 'storageConnection',
})

export async function processSurveyCreationStatisticMessage(queueItem: { surveyId: string }, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem.surveyId);

    // Create an initial statistic file
    const initialStatistic: SurveyStatistic = {
        submissionTotalCount: 0,
        submissionSuccessCount: 0,
        submissionFailureCount: 0,
        submissionSuccessRate: 0,
        submissionFailureRate: 0,
        submissionAverageDurationInMS: 0,
        submission: {}
    }

    // Save the initial statistic to the blob storage with the surveyId as the filename
    context.extraOutputs.set(blobOutput, initialStatistic);
}

app.storageQueue('processSurveyCreationStatisticMessage', {
    queueName: 'survey-statistic-message-001',
    connection: 'storageConnection',
    extraOutputs: [blobOutput],
    handler: processSurveyCreationStatisticMessage
});
