export const environment = {
  production: false,
  endpoints: {
    saveSurvey: 'http://localhost:7071/api/saveSurveyToCosmosDbHttp',
    saveSubmission: 'http://localhost:7071/api/saveSurveySubmissionToCosmosDbHttp',
    readSurvey: 'http://localhost:7071/api/readSurveyFromCosmosDbHttp',
  }
};
