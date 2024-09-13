import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import Stripe from 'stripe';

export async function stripeCheckoutSessionStatusHttp(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY);
        const session = await stripe.checkout.sessions.retrieve(request.query.get('session_id'));

        context.log(`Stripe Checkout session retrieved successfully`, session);

        return {
            jsonBody: {
                message: `Stripe Checkout session retrieved successfully`,
                data: { status: session.status, customerEmail: session.customer_details.email, surveyId: session.metadata.surveyId }
            }
        }

    } catch (error) {
        return {
            jsonBody: {
                message: `Failed to fetch Stripe Checkout session`,
                error: error.message || "An unexpected error occurred"
            },
            status: 500
        };

    }
};

app.http('stripeCheckoutSessionStatusHttp', {
    methods: ['GET'],
    authLevel: 'function',
    handler: stripeCheckoutSessionStatusHttp
});
