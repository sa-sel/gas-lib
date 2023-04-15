import { removeAccents } from '@lib/functions';

declare global {
  export interface String {
    removeAccents(): string;
  }
}

String.prototype.removeAccents = function (): string {
  return removeAccents(this);
};
