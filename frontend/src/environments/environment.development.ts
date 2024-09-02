export const environment = {
  production: false,
  endpoints: {
    saveSurvey: 'http://localhost:7071/api/saveSurveyToCosmosDbHttp',
    saveSubmission: 'http://localhost:7071/api/saveSurveySubmissionToCosmosDbHttp',
    readSurvey: 'http://localhost:7071/api/readSurveyFromCosmosDbHttp',
    getSurveyStatistic: 'http://localhost:7071/api/survey/{surveyId}/statistic',
  },
  appInsights: {
    connectionString: 'InstrumentationKey=306d0c23-ca56-42c8-b50b-dfe5022c7737;IngestionEndpoint=https://germanywestcentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://germanywestcentral.livediagnostics.monitor.azure.com/;ApplicationId=da009b8c-4793-4d39-8d9d-e5a03cd6abba'
  }
};
