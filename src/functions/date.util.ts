import { pad } from './string.util';

/** Format a Date to "DD/MM/YYYY". */
export const formatDate = (date: Date): string => {
  const day = pad(date.getDate(), 2);
  const month = pad(date.getMonth() + 1, 2);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/** Format a Date to "DD/MM/YYYY hh:mm:ss". */
export const formatTimestamp = (date: Date): string => {
  const hour = pad(date.getHours(), 2);
  const minute = pad(date.getMinutes(), 2);
  const second = pad(date.getSeconds(), 2);

  return `${formatDate(date)} ${hour}:${minute}:${second}`;
};
