export const toString = (data: any) => `${data}`.trim();

/** Convert number to string and add left zeroes (padding). */
export const pad = (n: number, width: number) => n.toString().padStart(width, '0');
