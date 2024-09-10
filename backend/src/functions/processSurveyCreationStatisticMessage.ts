import { app, InvocationContext, input, output } from "@azure/functions";

const blobInput = input.storageBlob({
    connection: 'storageConnection',
    path: 'statistic/{surveyId}.json',
});

const blobOutput = output.storageBlob({
    path: 'statistic/{surveyId}.json',
    connection: 'storageConnection',
})

export async function processSurveyCreationStatisticMessage(queueItem: unknown, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);

    const blob = context.extraInputs.get(blobInput);
    context.log('Blob content:', blob);
}

app.storageQueue('processSurveyCreationStatisticMessage', {
    queueName: 'survey-statistic-message-001',
    connection: 'storageConnection',
    extraInputs: [blobInput],
    extraOutputs: [blobOutput],
    handler: processSurveyCreationStatisticMessage
});
