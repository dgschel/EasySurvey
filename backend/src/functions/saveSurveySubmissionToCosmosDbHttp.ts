import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import { SubmissionSchema } from "../schemas/submission";
import { SurveySubmissionMessage } from "../models/queue-storage";

const cosmosOutput = output.cosmosDB({
    databaseName: 'SurveyDB',
    containerName: 'Submission',
    connection: 'cosmosDbConnection',
    partitionKey: '/surveyId',
});

const storageQueueOutput = output.storageQueue({
    queueName: 'survey-submission-messages-001',
    connection: 'storageConnection',
})

export async function saveSurveySubmissionToCosmosDbHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const submission = await request.json();

        // Check if there is a payload
        if (!submission || typeof submission !== 'object' || Object.keys(submission).length === 0) {
            throw new Error("Submission data is empty or invalid");
        }

        // Validate the submission data using zod schema definition
        const parsedSubmission = SubmissionSchema.omit({ id: true }).safeParse(submission);

        if (!parsedSubmission.success) {
            context.log(`Validation errors:`, parsedSubmission.error.errors);
            throw new Error("Submission data is invalid");
        }

        // Save the submission data to Cosmos DB
        context.extraOutputs.set(cosmosOutput, {
            id: context.invocationId, // Unique ID for the document
            ...parsedSubmission.data
        });

        const submissionMessage: SurveySubmissionMessage = {
            surveyId: parsedSubmission.data.surveyId,
            submissionId: context.invocationId,
            ...parsedSubmission.data.statistic
        }

        // Send the submission data to a storage queue
        context.extraOutputs.set(storageQueueOutput, submissionMessage);

        return { jsonBody: { message: `Submission saved successfully` }, status: 201 };

    } catch (error) {
        context.log(`Error:`, error);

        return {
            jsonBody: {
                message: error.message || "An unexpected error occurred",
            },
            status: 500
        };

    }
};

app.http('saveSurveySubmissionToCosmosDbHttp', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [cosmosOutput, storageQueueOutput],
    handler: saveSurveySubmissionToCosmosDbHttp
});
