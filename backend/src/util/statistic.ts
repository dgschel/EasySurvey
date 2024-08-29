/**
 * Summarize the survey statistic data
 * @param parsedSubmission The parsed submission data
 * @returns The summarized survey statistic data
 */
export function summarizeSurveyStatistic(parsedSubmission) {
  return parsedSubmission.data.reduce((acc, curr) => {
    const submission = curr.submission;

    for (const question in submission) {
      const answer = submission[question];

      // Initialize the question entry if not already initialized
      if (!acc[question]) {
        acc[question] = {};
      }

      // If the answer is an array, increment the count for each answer
      if (Array.isArray(answer)) {

        answer.forEach((value) => {
          if (!acc[question][value]) {
            acc[question][value] = 0;
          }

          // Increment the count for this answer
          acc[question][value] += 1;
        });
      }

      else {
        // Initialize the answer count if not already initialized
        if (!acc[question][answer]) {
          acc[question][answer] = 0;
        }

        // Increment the count for this answer
        acc[question][answer] += 1;
      }
    }

    return acc;
  }, {});
}

