import { app, InvocationContext, Timer } from "@azure/functions";

export async function manageSurveyLifecycle(myTimer: Timer, context: InvocationContext): Promise<void> {
    const timeStamp = new Date().toISOString();
    context.log('Timer function processed request at', timeStamp);
}

app.timer('ManageSurveyLifecycle', {
    schedule: '0 0 2 * * *',
    handler: manageSurveyLifecycle
});
