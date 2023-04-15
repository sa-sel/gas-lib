import { removeAccents } from '@lib/functions';

declare global {
  export interface String {
    removeAccents(): string;
    asPhoneNumber(): string;
  }
}

String.prototype.removeAccents = function (): string {
  return removeAccents(this);
};

String.prototype.asPhoneNumber = function (): string {
  const nums: string = this.replace(/\D/g, '');

  switch (nums.length) {
    case 13:
      return `+${nums.slice(0, 2)} (${nums.slice(2, 4)}) ${nums.slice(4, 9)}-${nums.slice(9)}`;

    case 12:
      return `+${nums.slice(0, 2)} (${nums.slice(2, 4)}) 9${nums.slice(4, 8)}-${nums.slice(8)}`;

    case 11:
      return `+55 (${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;

    case 10:
      return `+55 (${nums.slice(0, 2)}) 9${nums.slice(2, 6)}-${nums.slice(7)}`;

    case 9:
      return `+55 (16) ${nums.slice(0, 5)}-${nums.slice(5)}`;

    case 8:
      return `+55 (16) 9${nums.slice(0, 4)}-${nums.slice(4)}`;

    default:
      return nums;
  }
};
