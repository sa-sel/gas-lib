export const toString = (data: any) => `${data}`.trim();

/** Convert number to string and add left zeroes (padding). */
export const pad = (n: number, width: number) => n.toString().padStart(width, '0');

/** Remove accents/diacritics from a string.
 * @see https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
 */
export const removeAccents = (str: string): string => str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
