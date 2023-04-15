import { pad } from '@lib/functions';

declare global {
  export interface Number {
    pad(width: number): string;
  }
}

Number.prototype.pad = function (width: number): string {
  return pad(this, width);
};
