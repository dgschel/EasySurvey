
/**
 * Converts milliseconds to minutes
 * 
 * @param milliseconds - The number of milliseconds to convert
 * @returns The number of minutes
 */
export const convertMilisecondsToSecondOrMinutes = (milliseconds: number): number => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor(milliseconds / 1000);

  return minutes < 1 ? seconds : minutes;
};

export const getDisplayUnit = (milliseconds: number): string => milliseconds < 60000 ? "Sekunden" : "Minuten"