export function expect<T>(value: T | null | undefined, message: string): T {
  if (value === undefined || value === null) {
    throw new Error(`LIBRARY BUG: ${message}`);
  }

  return value;
}
