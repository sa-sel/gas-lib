/* eslint-disable @typescript-eslint/no-this-alias */

import { split } from '@lib/functions';

declare global {
  export interface Array<T> {
    /**
     * Split an array into multiple ones by a separator (or function result). Works similarly to `String.prototype.split`.
     *
     * @param sep separator element or function
     * @returns split array
     * @example [1, 2, 1, 2, 3, 4, 1, 1, 6].split(1) -> [[], [2], [2, 3, 4], [], [6]]
     */
    split(sep: T | ((o: T) => boolean)): T[][];
    /**
     * Appends new elements to the end of an array
     *
     * @param cond if elements should be appended
     * @param items new elements to add to the array
     * @returns new length of the array
     */
    pushIf(cond: any, ...items: T[]): number;
  }
}

Array.prototype.split = function <T>(sep: T | ((o: T) => boolean)): T[][] {
  const arr: Array<T> = this;

  return split(arr, sep);
};

Array.prototype.pushIf = function <T>(cond: any, ...items: T[]): number {
  const arr: Array<T> = this;

  return cond ? arr.push(...items) : arr.length;
};

Array.prototype.toString = function <T>(): string {
  const arr: Array<T> = this;

  return `${arr.slice(0, -1).join(', ')} e ${arr[arr.length - 1]}`;
};

Array.prototype.toLocaleString = function <T>(): string {
  const arr: Array<T> = this;

  return `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`;
};

export default {};
