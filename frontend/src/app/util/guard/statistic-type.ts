import { SubmissionCount } from "../type/statistic";

/**
 * Checks if the given object is of type SubmissionCount.
 * 
 * @param obj - The object to be checked.
 * @returns True if the object is of type SubmissionCount, false otherwise.
 */
export const isSubmissionCount = (obj: any): obj is SubmissionCount => {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).every(key => typeof key === 'string' && typeof obj[key] === 'number');
};

/**
 * Checks if the given object is an array of strings.
 * 
 * @param obj - The object to be checked.
 * @returns A boolean indicating whether the object is an array of strings.
 */
export const isSubmissionInputCount = (obj: any): obj is string[] => {
  return Array.isArray(obj) && obj.every(value => typeof value === 'string');
};

/**
 * Checks if the given object is of type SubmissionCount or string[].
 * @param obj - The object to be checked.
 * @returns True if the object is of type SubmissionCount or string[], false otherwise.
 */
export const isSubmissionCountResponse = (obj: any): obj is SubmissionCount | string[] => {
  return isSubmissionCount(obj) || isSubmissionInputCount(obj);
}