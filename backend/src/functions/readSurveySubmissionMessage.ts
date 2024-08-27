import { app, InvocationContext } from "@azure/functions";

export async function readSurveySubmissionMessage(queueItem: unknown, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);
}

app.storageQueue('readSurveySubmissionMessage', {
    queueName: 'survey-submission-messages-001',
    connection: 'storageConnection',
    handler: readSurveySubmissionMessage
});
