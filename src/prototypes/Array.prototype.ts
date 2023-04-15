import { split } from '@lib/functions';

declare global {
  export interface Array<T> {
    /**
     * Split an array into multiple ones by a separator (or function result). Works similarly to `String.prototype.split`.
     * @example [1, 2, 1, 2, 3, 4, 1, 1, 6].split(1) -> [[], [2], [2, 3, 4], [], [6]]
     */
    split(sep: T | ((o: T) => boolean)): T[][];
  }
}

Array.prototype.split = function <T>(sep: T | ((o: T) => boolean)): T[][] {
  return split(this, sep);
};
