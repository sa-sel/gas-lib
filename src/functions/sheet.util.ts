import { Sheet } from '@lib/models';
import { copyFormulas, setValues } from './range.util';

export const isSameSheet = (a: Sheet, b: Sheet): boolean => a.getSheetId() === b.getSheetId();

export const isSheetOneOf = (sheet: Sheet, options: Sheet[]): boolean => options.some(opt => isSameSheet(opt, sheet));

/** Remove all empty rows in `sheet`, leaving at least one row (empty or not) left. */
export const removeEmptyRows = (sheet: Sheet, headers = sheet.getFrozenRows()) => {
  /** All non-empty data rows in the sheet. */
  const sheetData = sheet
    .getDataRange()
    .getValues()
    .filter(row => row.every(cell => cell));

  // delete a number of rows equal to the number of empty
  // rows and restore the sheet data on the remaining ones
  sheet.deleteRows(headers + (sheetData.length || 1), sheet.getMaxRows() - sheetData.length);
  sheet.getRange(headers + 1, 1, sheetData.length, sheetData[0].length).setValues(sheetData);
};

/**
 * @param data data to be appended
 * @param sheet sheet to append `data` to
 * @param mapFn function to map each `data` element to a row (cells can be skipped using `undefined`)
 */
export const appendDataToSheet = <T>(data: T[], sheet: Sheet, mapFn: (obj: T) => any[] = obj => obj as unknown as any[]): void => {
  if (!data.length) {
    return;
  }

  const prevNRows = sheet.getMaxRows();
  const newRowsData = data.map(mapFn);
  const nColsNewRows = newRowsData[0].length;
  const prevLastRow = sheet.getRange(prevNRows, 1, 1, newRowsData.length);

  // if the last row is empty, insert data in it
  if (
    prevLastRow
      .getValues()
      .flat()
      .every(v => !v)
  ) {
    setValues(prevLastRow, [newRowsData.pop()]);
  }

  // if there's any data remaining to be inserted
  if (newRowsData.length) {
    const newRange = sheet.insertRowsAfter(prevNRows, newRowsData.length).getRange(prevNRows + 1, 1, newRowsData.length, nColsNewRows);

    // restore formulas on the new range
    copyFormulas(sheet.getRange(prevNRows, 1, 1, sheet.getMaxColumns()), newRange);

    // write data to the new range
    setValues(newRange, newRowsData);
  }
};

/** Clear content from a whole sheet except for the header rows. */
export const clearSheet = (sheet: Sheet, headers = sheet.getFrozenRows()) =>
  sheet.getRange(1 + headers, 1, sheet.getMaxRows(), sheet.getMaxColumns()).clearContent();

/**
 * Create new columns in `sheet` and set their first cells' values to `headerValues` and restore formulas in them.
 * @param sheet the target sheet
 * @param values the values to be put in the columns
 */
export const addColsToSheet = (sheet: Sheet, values: any[][]): void => {
  if (!values.length || !values[0].length) {
    return;
  }

  const prevNCols = sheet.getMaxColumns();
  const nRows = sheet.getMaxRows();
  const prevLastCol = sheet.getRange(1, prevNCols, nRows, 1);

  // if the last col is empty, insert data in it
  if (
    prevLastCol
      .getValues()
      .flat()
      .every(v => !v)
  ) {
    const colValues = [];

    for (const row of values) {
      colValues.push([row.pop()]);
    }

    setValues(prevLastCol, colValues);
  }

  if (values.length && values[0].length) {
    const newRange = sheet.insertColumnsAfter(prevNCols, values[0].length).getRange(1, prevNCols + 1, values.length, values[0].length);

    // restore formulas on the new range
    copyFormulas(sheet.getRange(1, prevNCols, nRows, 1), newRange);

    // write data to the new range
    setValues(newRange, values);
  }
};
