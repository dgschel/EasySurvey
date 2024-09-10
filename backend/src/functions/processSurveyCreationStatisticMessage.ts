import { app, InvocationContext, output } from "@azure/functions";

const blobOutput = output.storageBlob({
    path: 'statistic/{surveyId}.json',
    connection: 'storageConnection',
})

export async function processSurveyCreationStatisticMessage(queueItem: unknown, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);

    // Read blob and create an initial statistic file
    const blob = context.extraOutputs.get(blobOutput);
}

app.storageQueue('processSurveyCreationStatisticMessage', {
    queueName: 'survey-statistic-message-001',
    connection: 'storageConnection',
    extraOutputs: [blobOutput],
    handler: processSurveyCreationStatisticMessage
});
