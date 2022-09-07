import { callIfFn } from './function.util';

export const split = (arr: any[], sep: any | ((o: any) => boolean)) =>
  arr.reduce(
    (acc: any[][], cur) => {
      callIfFn(sep, { args: [cur], altFn: () => cur === sep }) ? acc.push([]) : acc[acc.length - 1].push(cur);

      return acc;
    },
    [[]],
  );
