import { Range, Sheet } from '@lib/models';
import { transpose } from './array.util';
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
 * @returns edited range
 */
export const appendDataToSheet = <T>(data: T[], sheet: Sheet, mapFn: (obj: T) => any[] = obj => obj as unknown as any[]): Range => {
  if (!data.length) {
    return null;
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

    return newRange;
  } else {
    return prevLastRow;
  }
};

/** Clear content from a whole sheet except for the header rows. */
export const clearSheet = (sheet: Sheet, headers = sheet.getFrozenRows()) =>
  sheet.getRange(1 + headers, 1, sheet.getMaxRows(), sheet.getMaxColumns()).clearContent();

/**
 * Create new columns in `sheet` and set their first cells' values to `headerValues` and restore formulas in them.
 * @param sheet the target sheet
 * @param values the values to be put in the columns (list of columns)
 */
export const addColsToSheet = (sheet: Sheet, values: any[][]): void => {
  if (!values.length || !values[0].length) {
    return;
  }

  const prevNCols = sheet.getMaxColumns();
  const nRows = sheet.getMaxRows();
  const prevLastCol = sheet.getRange(1, prevNCols, nRows, 1);

  // convert values from list of cols to list of rows
  values = transpose(values);

  // if the last col is empty, insert data in it
  if (
    prevLastCol
      .getValues()
      .flat()
      .every(v => !v)
  ) {
    setValues(prevLastCol, values.pop());
  }

  if (values.length && values[0].length) {
    const newRange = sheet.insertColumnsAfter(prevNCols, values[0].length).getRange(1, prevNCols + 1, values.length, values[0].length);

    // restore formulas on the new range
    copyFormulas(sheet.getRange(1, prevNCols, nRows, 1), newRange);

    // write data to the new range
    setValues(newRange, values);
  }
};

/** Delete a row if it's not a header nor the last content row, otherwise clear it's content and restore the formulas. */
export const safeDeleteRow = (sheet: Sheet, rowPos: number, headers = sheet.getFrozenRows()): void => {
  const rowRange = sheet.getRange(rowPos, 1, 1, sheet.getMaxColumns());

  if (sheet.getMaxRows() - headers === 1) {
    // in case except for the headers there's only this row, clear
    // it's content and restore the formulas instead of deleting it

    const formulas = rowRange.getFormulas();

    rowRange.clearContent().uncheck().setFormulas(formulas);
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

    const formulas = colRange.getFormulas();

    colRange.clearContent().uncheck().setFormulas(formulas);
  } else if (colPos > headers) {
    // in case there's many other cols and
    // target col is not a header, delete it

    sheet.deleteColumn(colPos);
  }
};
