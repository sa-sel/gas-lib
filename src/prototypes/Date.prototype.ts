import { formatDate, formatTimestamp } from '@lib/functions';

declare global {
  export interface Date {
    formatToDate(): string;
    formatToTimestamp(): string;
  }
}

Date.prototype.formatToDate = function (): string {
  return formatDate(this);
};

Date.prototype.formatToTimestamp = function (): string {
  return formatTimestamp(this);
};
