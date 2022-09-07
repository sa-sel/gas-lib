export const isFn = (fn: any) => typeof fn === 'function';

export const safeCall = <T>(fn: (...args: any[]) => T, ...args: any[]) => fn && fn(...args);

export const callIfFn = <T>(fn: any | ((...args: any[]) => T), opts?: { altFn?: (o: any, ...args: any[]) => T; args?: any[] }): any =>
  isFn(fn) ? fn(opts?.args) : safeCall(opts?.altFn, fn, ...(opts?.args ?? []));
