// HINT: Dont use this type for angular components, use it for plain objects instead.

/**
 * Represents a type that infers the values of an object's properties.
 * @template T - The type of the object
 */
export type InferObj<T> = { [P in keyof T]?: T[P] extends Record<string, infer U> ? U : any };