import { HttpWrapper } from '../type/http';

/**
 * Checks if the given response is a valid `HttpWrapper` object.
 *
 * @template T - The type of the data contained in the `HttpWrapper`.
 * @param response - The response object to check.
 * @returns A type predicate indicating whether the response is a valid `HttpWrapper<T>`.
 */
export const isValidResponseGuard = <T>(
    response: HttpWrapper<T> | null,
): response is HttpWrapper<T> => {
    return response !== null && typeof response.data !== 'undefined';
};
