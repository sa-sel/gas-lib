export const safeCall = <T>(fn: (...args: any[]) => T, ...args: any[]) => fn && fn(...args);
