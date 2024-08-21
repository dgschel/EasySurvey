// WIP: Update the endpoints to point to the Azure Functions

export const environment = {
  production: true,
  endpoints: {
    saveSurvey: 'https://localhost:7071/api/saveSurveyToCosmosDbHttp',
    saveSubmission: 'http://localhost:7071/api/saveSurveySubmissionToCosmosDbHttp',
    readSurvey: 'https://localhost:7071/api/readSurveyFromCosmosDbHttp',
  }
};
