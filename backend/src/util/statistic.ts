import { SurveyModel, SurveyStatisticSummary } from "../models/survey";

/**
 * Summarize the survey statistic data
 * @param parsedSubmission The parsed submission data
 * @returns The summarized survey statistic data
 */
export function summarizeSurveyStatistic(parsedSubmission: {
  submission?: Record<string, string | string[]>;
}[]) {
  return parsedSubmission.reduce((acc, curr) => {
    const { submission } = curr;

    for (const question in submission) {
      const answer = submission[question];

      // Initialize the question entry if not already initialized
      if (!acc[question]) {
        acc[question] = {};
      }

      // If the answer is an array, increment the count for each answer
      if (Array.isArray(answer)) {

        // Increment the count for each answer
        // Empty answers are ignored
        answer.forEach((value) => {
          if (!acc[question][value]) {
            acc[question][value] = 0; // Initialize the answer count if not already initialized
          }

          // Increment the count for this answer
          acc[question][value] += 1;
        });
      }

      else {
        // If the answer was not provided, use "No answer" as the key
        const key = answer === "" ? "No answer" : answer;

        // Initialize the answer count if not already initialized
        if (!acc[question][key]) {
          acc[question][key] = 0;
        }

        // Increment the count for this key
        acc[question][key] += 1;
      }
    }

    return acc;
  }, {} as SurveyStatisticSummary);
}


export function mapInputModelToSubmission(models: SurveyModel[], aggregatedSubmission: SurveyStatisticSummary) {
  if (!models || models.length === 0 || !aggregatedSubmission || Object.keys(aggregatedSubmission).length === 0) return {};

  return models.reduce((acc, curr) => {
    if (curr.type === 'input') {
      return {
        ...acc,
        [curr.title]: Object.keys(aggregatedSubmission[curr.title])
      };
    }
    return acc;
  }, {} as Record<string, string[]>);
}
