// WIP: Update the endpoints to point to the Azure Functions

export const environment = {
  production: true,
  apiUrl: 'http://localhost:7071/api',
  endpoints: {
    saveSurvey: 'saveSurveyToCosmosDbHttp',
    saveSubmission: 'saveSurveySubmissionToCosmosDbHttp',
    readSurvey: 'readSurveyFromCosmosDbHttp',
    getSurveyStatistic: 'survey/{surveyId}/statistic',
    createQRCode: 'createQRCodeHttp',
    surveyPaymentStatus: 'survey/{surveyId}/payment-status',
    stripeCheckout: 'createStripeCheckoutSessionHttp',
    stripeCheckoutSessionStatus: 'stripeCheckoutSessionStatusHttp'
  },
  stripe: {
    publicKey: 'pk_test_51H2cteFqohewLde01E4dKVd9Vtv3r7Cqcwo3OBF2j1gICzkOiGdSwn893njCErZtd8cwUwEonqyVHCfWGEENoUTx00rjpT4g2T'
  },
  appInsights: {
    connectionString: 'InstrumentationKey=9d844b42-2de9-41e2-9458-6709302cbb32;IngestionEndpoint=https://germanywestcentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://germanywestcentral.livediagnostics.monitor.azure.com/;ApplicationId=e330c31a-bc19-439e-93f3-2ad0efdc5261'
  }
};
