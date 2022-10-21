import { callIfFn } from './function.util';

/**
 * Split an array into multiple ones by a separator (or function result). Works similarly to `String.prototype.split`.
 * @example split([1, 2, 1, 2, 3, 4, 1, 1, 6], 1) -> [[], [2], [2, 3, 4], [], [6]]
 */
export const split = (arr: any[], sep: any | ((o: any) => boolean)) =>
  arr.reduce(
    (acc: any[][], cur) => {
      callIfFn(sep, { args: [cur], altFn: () => cur === sep }) ? acc.push([]) : acc[acc.length - 1].push(cur);

      return acc;
    },
    [[]],
  );

/**
 * Transpose a 2D array.
 * @example transpose([[1, 2, 3, 4], [5, 6, 7, 8]]) -> [[1, 5], [2, 6], [3, 7], [4, 8]]
 */
export const transpose = (mat: any[][]) => mat.reduce((acc, cur) => cur.map((_, i) => (acc[i] || []).concat(cur[i])), []);
