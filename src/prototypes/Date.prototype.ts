/* eslint-disable @typescript-eslint/no-this-alias */

declare global {
  export interface Date {
    /** "DD/MM/YYYY" */
    asDateString(): string;
    /** "YYYY/MM/DD" */
    asReverseDateString(): string;
    /** "DD/MM/YYYY hh:mm:ss" */
    asTimestamp(): string;
    /** "hh:mm:ss" */
    asTime(): string;
  }
}

Date.prototype.asDateString = function (): string {
  const date: Date = this;

  return `${date.getDate().withLeadingZeros(2)}/${(date.getMonth() + 1).withLeadingZeros(2)}/${date.getFullYear()}`;
};

Date.prototype.asReverseDateString = function (): string {
  const date: Date = this;

  return `${date.getFullYear()}/${(date.getMonth() + 1).withLeadingZeros(2)}/${date.getDate().withLeadingZeros(2)}`;
};

Date.prototype.asTime = function (): string {
  const date: Date = this;

  return `${date.getHours().withLeadingZeros(2)}:${date.getMinutes().withLeadingZeros(2)}:${date.getSeconds().withLeadingZeros(2)}`;
};

Date.prototype.asTimestamp = function (): string {
  const date: Date = this;

  return `${date.asDateString()} ${date.asTime()}`;
};

export default {};
