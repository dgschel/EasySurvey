import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import Stripe from 'stripe';

import { SurveyCosmosDbSchema } from "../schemas/survey";

export async function createStripeCheckoutSessionHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const payload = await request.json();

        // Validate the payload
        const parsedPayload = SurveyCosmosDbSchema.pick({ id: true }).safeParse(payload);

        if (!parsedPayload.success) {
            context.log("Validation Error", parsedPayload.error.errors);
            throw new Error("Payload is invalid");
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY);
        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price: process.env.STRIPE_PRICE_ID,
                quantity: 1
            }],
            mode: 'payment',
            ui_mode: 'embedded',
            return_url: `${request.headers.get('origin')}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
            metadata: { // Save surveyId in the session metadata
                surveyId: parsedPayload.data.id
            },
            payment_intent_data: { // Save surveyId in the payment intent metadata. This is useful to quickly search in the stripe dashboard for a payment intent related to a survey
                metadata: {
                    surveyId: parsedPayload.data.id
                }
            },
            automatic_tax: { enabled: true }, // Enable automatic tax calculation
        });

        return {
            jsonBody: {
                message: `Stripe Checkout session created successfully`,
                data: {
                    clientSecret: session.client_secret,
                }
            }
        }

    } catch (error) {
        return {
            jsonBody: {
                message: `Failed to create Stripe Checkout session`,
                error: error.message || "An unexpected error occurred"
            },
            status: 500
        };
    }
};

app.http('createStripeCheckoutSessionHttp', {
    methods: ['POST'],
    authLevel: 'function',
    handler: createStripeCheckoutSessionHttp
});
