export const isFn = (fn: any) => typeof fn === 'function';

export const suppressError = <T>(fn: () => T): T | null => {
  try {
    return fn();
  } catch {
    return null;
  }
};

/** Call a function if it exists. */
export const safeCall = <T>(fn: (...args: any[]) => T, ...args: any[]) => fn && fn(...args);

/** Call a variable if it is a function. Otherwise, call an alternative function. */
export const callIfFn = <T>(fn: any | ((...args: any[]) => T), opts?: { altFn?: (o: any, ...args: any[]) => T; args?: any[] }): any =>
  isFn(fn) ? fn(opts?.args) : safeCall(opts?.altFn, fn, ...(opts?.args ?? []));

export const evaluate = <T>(maybeFn: T | (() => T)): T => (typeof maybeFn === 'function' ? (maybeFn as () => T)() : maybeFn);
