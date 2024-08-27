import { app, input, InvocationContext, output } from "@azure/functions";

const blobInput = input.storageBlob({
    path: 'statistic/{surveyId}.json',
    connection: 'storageConnection',
});

const blobOutput = output.storageBlob({
    path: 'statistic/{surveyId}.json',
    connection: 'storageConnection',
})

export async function readSurveySubmissionMessage(queueItem: unknown, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);

    const blob = context.extraInputs.get(blobInput)

    if (blob) {
        // Log the blob
        context.log('Blob:', blob);
    }
    else {
        // Save the blob to the output
        context.extraOutputs.set(blobOutput, queueItem)
    }
}

app.storageQueue('readSurveySubmissionMessage', {
    queueName: 'survey-submission-messages-001',
    connection: 'storageConnection',
    extraInputs: [blobInput],
    extraOutputs: [blobOutput],
    handler: readSurveySubmissionMessage
});
