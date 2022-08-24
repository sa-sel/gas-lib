import { AppendDataToSheetOpts, Range, ReadDataFromSheetOpts, Sheet } from '@lib/models';

export const isSameSheet = (a: Sheet, b: Sheet): boolean => a.getSheetId() === b.getSheetId();

/** Remove all empty rows in `sheet`, leaving at least one row (empty or not) left. */
export const removeEmptyRows = (sheet: Sheet) => {
  /** All non-empty data rows in the sheet. */
  const sheetData = sheet
    .getDataRange()
    .getValues()
    .filter(row => row.every(cell => cell));

  // delete a number of rows equal to the number of empty
  // rows and restore the sheet data on the remaining ones
  sheet.deleteRows(sheetData.length + 1, sheet.getMaxRows() - sheetData.length);
  sheet.getRange(1, 1, sheetData.length, sheetData[0].length).setValues(sheetData);
};

export const appendDataToSheet = <T>(data: T[], sheet: Sheet, { mapFn, headers = sheet.getFrozenRows() }: AppendDataToSheetOpts<T>) => {
  if (!data.length) {
    return;
  }

  const prevNRows = sheet.getLastRow();
  const newRowsData = data.map(mapFn);
  const nColsNewRows = newRowsData[0].length;
  const firstRow = sheet.getRange(1 + headers, 1, 1, newRowsData.length);

  // if the first row is empty, insert a member in it
  if (!firstRow.getValues()[0].reduce((acc, cur) => acc || cur)) {
    firstRow.setValues([newRowsData.pop()]);
  }

  // append remaining members to the sheet
  sheet
    .insertRowsAfter(prevNRows, newRowsData.length)
    .getRange(prevNRows + 1, 1, newRowsData.length, nColsNewRows)
    .setValues(newRowsData);

  const nColsNotWritten = sheet.getMaxColumns() - nColsNewRows;

  // restore formulas on columns in which no data was written (if there is any)
  if (nColsNotWritten) {
    /** Range of empty columns in which no data was written, to the right of the new rows. */
    const newEmptyColsRange = sheet.getRange(prevNRows + 1, nColsNewRows + 1, newRowsData.length, nColsNotWritten);

    copyFormulas(sheet.getRange(prevNRows, nColsNewRows + 1, 1, nColsNotWritten), newEmptyColsRange);
  }
};

/**
 * Read all non-empty rows from `sheet` and convert them (via `mapFn`) to a list of objects (type `T`).
 * Header rows (`headers`) will be ignored.
 */
export const readDataFromSheet = <T>(sheet: Sheet, { mapFn, headers = sheet.getFrozenRows() }: ReadDataFromSheetOpts<T>): T[] =>
  sheet
    .getRange(1 + headers, 1, sheet.getMaxRows(), sheet.getMaxColumns())
    .getValues()
    .reduce((acc, cur) => {
      if (cur.some(cell => cell)) {
        acc.push(mapFn(cur));
      }

      return acc;
    }, []);

/** Clear content from a whole sheet except for the header rows. */
export const clearSheet = (sh: Sheet, headers = sh.getFrozenRows()) =>
  sh.getRange(1 + headers, 1, sh.getMaxRows(), sh.getMaxColumns()).clearContent();

/** Create new columns in `sheet` and set their first cells' values to `headerValues` and restore formulas in them. */
export const addColsToSheet = <T>(sheet: Sheet, headerValues: T[]): number => {
  const pos = sheet.getLastColumn();
  const nRows = sheet.getMaxRows();

  // insert new columns and set it to the header value
  sheet
    .insertColumnsAfter(pos, headerValues.length)
    .getRange(1, pos + 1, 1, headerValues.length)
    .setValues(headerValues.map(column => [column]));

  // restore formulas in the new columns
  copyFormulas(sheet.getRange(2, pos, nRows - 1, 1), sheet.getRange(2, pos + 1, nRows - 1, headerValues.length));

  return pos + headerValues.length;
};

/** Copy formulas from `reference` to `target`. */
export const copyFormulas = (reference: Range, target: Range): void => {
  const targetValues = target.getValues();

  reference.copyTo(target, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);

  const formulas = target.getFormulas();

  target.clearContent().setValues(targetValues).setFormulas(formulas);
};
