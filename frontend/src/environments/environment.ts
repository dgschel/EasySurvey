// WIP: Update the endpoints to point to the Azure Functions

export const environment = {
  production: true,
  endpoints: {
    saveSurvey: 'https://localhost:7071/api/saveSurveyToCosmosDbHttp',
    saveSubmission: 'http://localhost:7071/api/saveSurveySubmissionToCosmosDbHttp',
    readSurvey: 'https://localhost:7071/api/readSurveyFromCosmosDbHttp',
    getSurveyStatistic: 'http://localhost:7071/api/survey/{surveyId}/statistic',
  },
  appInsights: {
    connectionString: 'InstrumentationKey=9d844b42-2de9-41e2-9458-6709302cbb32;IngestionEndpoint=https://germanywestcentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://germanywestcentral.livediagnostics.monitor.azure.com/;ApplicationId=e330c31a-bc19-439e-93f3-2ad0efdc5261'
  }
};
