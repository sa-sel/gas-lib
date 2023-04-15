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
  return split(this, sep);
};

Array.prototype.pushIf = function <T>(cond: any, ...items: T[]): number {
  return cond ? this.push(...items) : this.length;
};

Array.prototype.toString = function (): string {
  return `${this.slice(0, -1).join(', ')} e ${this[this.length - 1]}`;
};

Array.prototype.toLocaleString = function (): string {
  return `${this.slice(0, -1).join(', ')} and ${this[this.length - 1]}`;
};
