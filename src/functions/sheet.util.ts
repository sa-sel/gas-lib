import { Range, Sheet } from '@lib/models';
import { transpose } from './array.util';
import { copyFormat, copyFormulas, safeClearContent, setValues } from './range.util';

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
 * @returns edited range
 */
export const appendDataToSheet = <T>(data: T[], sheet: Sheet, mapFn: (obj: T) => any[] = obj => obj as unknown as any[]): Range => {
  if (!data.length) {
    return null;
  }

  let nNextRow = sheet.getLastRow() + 1;
  const nFrozenRows = sheet.getFrozenRows();
  const newRowsData = data.map(mapFn);
  const nColsNewRows = newRowsData[0].length;
  const emptyRow = sheet.getRange(nNextRow, 1, 1, nColsNewRows);

  // insert data in the first empty row (if there's any)
  // tries to identify borders in the sheet
  if (
    (nNextRow < sheet.getMaxRows() || nNextRow === nFrozenRows + 1) &&
    emptyRow
      .getValues()
      .flat()
      .every((v, i) => v === undefined || v === '' || newRowsData[newRowsData.length - 1][i] === undefined)
  ) {
    setValues(emptyRow, [newRowsData.pop()]);
    nNextRow++;
  }

  // if there's any data remaining to be inserted
  if (newRowsData.length) {
    const newRange = sheet.insertRowsAfter(nNextRow - 1, newRowsData.length).getRange(nNextRow, 1, newRowsData.length, nColsNewRows);
    const prevRange = sheet.getRange(nNextRow - 1, 1, 1, sheet.getMaxColumns());

    // restore formulas on the new range
    copyFormulas(prevRange, newRange);

    // restore cell formatting on the new range
    copyFormat(prevRange, newRange);

    // write data to the new range
    setValues(newRange, newRowsData);

    return newRange;
  } else {
    return emptyRow;
  }
};

/** Clear content from a whole sheet except for the header rows. */
export const clearSheet = (sheet: Sheet, headers = sheet.getFrozenRows()) =>
  sheet.getRange(1 + headers, 1, sheet.getMaxRows(), sheet.getMaxColumns()).clearContent();

/**
 * Create new columns in `sheet` and set their first cells' values to `headerValues` and restore formulas in them.
 * @param data the values to be put in the columns (list of columns)
 * @param sheet the target sheet
 */
export const addColsToSheet = (data: any[][], sheet: Sheet): void => {
  if (!data.length || !data[0].length) {
    return;
  }

  const prevNCols = sheet.getMaxColumns();
  const nRows = sheet.getMaxRows();
  const prevLastCol = sheet.getRange(1, prevNCols, nRows, 1);

  // insert data in the first col if it's empty
  if (
    prevLastCol
      .getValues()
      .flat()
      .every((v, i) => v === undefined || v === '' || data[data.length - 1][i] === undefined)
  ) {
    setValues(prevLastCol, transpose([data.pop()]));
  }

  // convert values from list of cols to list of rows
  data = transpose(data);

  if (data.length && data[0].length) {
    const newRange = sheet.insertColumnsAfter(prevNCols, data[0].length).getRange(1, prevNCols + 1, data.length, data[0].length);
    const prevRange = sheet.getRange(1, prevNCols, nRows, 1);

    // restore formulas on the new range
    copyFormulas(prevRange, newRange);

    // restore cell formatting on the new range
    copyFormat(prevRange, newRange);

    // write data to the new range
    setValues(newRange, data);
  }
};

/** Delete a row if it's not a header nor the last content row, otherwise clear it's content and restore the formulas. */
export const safeDeleteRow = (sheet: Sheet, rowPos: number, headers = sheet.getFrozenRows()): void => {
  const rowRange = sheet.getRange(rowPos, 1, 1, sheet.getMaxColumns());

  if (sheet.getMaxRows() - headers === 1) {
    // in case except for the headers there's only this row, clear
    // it's content and restore the formulas instead of deleting it
    safeClearContent(rowRange);
  } else if (rowPos > headers) {
    // in case there's many other rows and
    // target row is not a header, delete it
    sheet.deleteRow(rowPos);
  }
};

/** Delete a column if it's not a header nor the last content column, otherwise clear it's content and restore the formulas. */
export const safeDeleteCol = (sheet: Sheet, colPos: number, headers = sheet.getFrozenColumns()): void => {
  const colRange = sheet.getRange(1, colPos, sheet.getMaxRows(), 1);

  if (sheet.getMaxColumns() - headers === 1) {
    // in case except for the headers there's only this col, clear
    // it's content and restore the formulas instead of deleting it
    safeClearContent(colRange);
  } else if (colPos > headers) {
    // in case there's many other cols and
    // target col is not a header, delete it
    sheet.deleteColumn(colPos);
  }
};
