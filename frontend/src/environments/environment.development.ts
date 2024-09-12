export const environment = {
  production: false,
  apiUrl: 'http://localhost:7071/api',
  endpoints: {
    saveSurvey: 'saveSurveyToCosmosDbHttp',
    saveSubmission: 'saveSurveySubmissionToCosmosDbHttp',
    readSurvey: 'readSurveyFromCosmosDbHttp',
    getSurveyStatistic: 'survey/{surveyId}/statistic',
    createQRCode: 'createQRCodeHttp',
    stripeCheckout: 'createStripeCheckoutSessionHttp'
  },
  stripe: {
    publicKey: 'pk_test_51H2cteFqohewLde01E4dKVd9Vtv3r7Cqcwo3OBF2j1gICzkOiGdSwn893njCErZtd8cwUwEonqyVHCfWGEENoUTx00rjpT4g2T'
  },
  appInsights: {
    connectionString: 'InstrumentationKey=306d0c23-ca56-42c8-b50b-dfe5022c7737;IngestionEndpoint=https://germanywestcentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://germanywestcentral.livediagnostics.monitor.azure.com/;ApplicationId=da009b8c-4793-4d39-8d9d-e5a03cd6abba'
  }
};
