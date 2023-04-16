/* eslint-disable @typescript-eslint/no-this-alias */

declare global {
  export interface Number {
    /** Convert number to string and add leading zeroes (padding). */
    withLeadingZeros(width: number): string;
  }
}

Number.prototype.withLeadingZeros = function (width: number): string {
  const n: number = this;

  return n.toString().padStart(width, '0');
};

export default {};
