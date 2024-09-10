import { app, InvocationContext, input } from "@azure/functions";

const blobInput = input.storageBlob({
    connection: 'storageConnection',
    path: 'statistic/{surveyId}.json',
});

export async function processSurveyCreationStatisticMessage(queueItem: unknown, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);
}

app.storageQueue('processSurveyCreationStatisticMessage', {
    queueName: 'survey-statistic-message-001',
    connection: 'storageConnection',
    extraInputs: [blobInput],
    handler: processSurveyCreationStatisticMessage
});
