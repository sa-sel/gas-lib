/** Format a Date to "DD/MM/YYYY". */
export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/** Format a Date to "DD/MM/YYYY hh:mm:ss". */
export const formatTimestamp = (date: Date): string => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${formatDate(date)} ${hour}:${minute}:${second}`;
};
