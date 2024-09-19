export type StripeCheckoutSessionStatus = {
  status: "complete" | "expired" | "open"; // The status of the Stripe Checkout session
  customerEmail: string;
  surveyId: string;
};