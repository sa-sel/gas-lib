/** Format a date to DD/MM/YYYY. */
export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
