import { callIfFn } from './function.util';

/**
 * Split an array into multiple ones by a separator (or function result). Works similarly to `String.prototype.split`.
 * @example split([1, 2, 1, 2, 3, 4, 1, 1, 6], 1) -> [[], [2], [2, 3, 4], [], [6]]
 */
export const split = <T>(arr: T[], sep: T | ((o: T) => boolean)): T[][] =>
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

/**
 * @param elements target elements you want to check
 * @param list list you want to check if the elments are into
 * @return `return[i]` = if `list` contains `elements[i]`
 */
export const areElementsInList = <T>(elements: T[], list: T[], compare = (a: T, b: T) => a === b): boolean[] =>
  list.reduce((acc, cur) => elements.map((target, i) => acc[i] || compare(target, cur)), Array(elements.length).fill(false));
