import { app, InvocationContext } from "@azure/functions";

export async function processSurveyCreationStatisticMessage(queueItem: unknown, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);
}

app.storageQueue('processSurveyCreationStatisticMessage', {
    queueName: 'survey-statistic-message-001',
    connection: 'storageConnection',
    handler: processSurveyCreationStatisticMessage
});
