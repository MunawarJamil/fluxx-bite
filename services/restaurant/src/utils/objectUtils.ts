/**
 * A mapped type that strips `undefined` from all property value types
 * while preserving optional key modifiers (`?`).
 *
 * With `exactOptionalPropertyTypes: true`, an optional key `foo?: string | null | undefined`
 * is NOT assignable to `foo?: string | null` because `undefined` is not in the value union.
 * This type fixes that mismatch after `cleanData` removes all undefined values at runtime.
 */
type NoUndefinedValues<T> = {
    [K in keyof T]: Exclude<T[K], undefined>;
};

/**
 * Removes undefined properties from an object.
 * Useful for Prisma where exactOptionalPropertyTypes is enabled.
 * Returns a type-safe version where `undefined` is excluded from all value unions.
 */
export const cleanData = <T extends object>(obj: T): NoUndefinedValues<T> => {
    const cleaned = { ...obj };
    (Object.keys(cleaned) as (keyof T)[]).forEach((key) => {
        if (cleaned[key] === undefined) {
            delete cleaned[key];
        }
    });
    return cleaned as NoUndefinedValues<T>;
};
