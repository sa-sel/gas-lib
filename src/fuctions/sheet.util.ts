import { Range, Sheet } from '@lib/models';

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

/**
 * @param data data to be appended
 * @param sheet sheet to append `data` to
 * @param mapFn function to map each `data` element to a row
 */
export const appendDataToSheet = <T>(data: T[], sheet: Sheet, mapFn: (member: T) => any[]): void => {
  if (!data.length) {
    return;
  }

  const prevNRows = sheet.getMaxRows();
  const newRowsData = data.map(mapFn);
  const nColsNewRows = newRowsData[0].length;
  const prevLastRow = sheet.getRange(prevNRows, 1, 1, newRowsData.length);

  // if the last or first row is empty, insert data in it
  if (
    !prevLastRow
      .getValues()
      .flat()
      .reduce((acc, cur) => acc || cur)
  ) {
    prevLastRow.setValues([newRowsData.pop()]);
  }

  if (newRowsData.length) {
    // append remaining data to the sheet
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
  }
};

/**
 * Read all non-empty rows from `sheet` and convert them to a list of objects.
 * @param sheet sheet to append `data` to
 * @param mapFn function to map each row element to a data object
 * @param headers number of rows to be ignored when reading
 */
export const readDataFromSheet = <T>(sheet: Sheet, mapFn: (row: any[]) => T, headers = sheet.getFrozenRows()): T[] =>
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

/**
 * Create new columns in `sheet` and set their first cells' values to `headerValues` and restore formulas in them.
 * @param sheet the target sheet
 * @param headerValues the values to be put in the column's first cell
 */
export const addColsToSheet = <T>(sheet: Sheet, headerValues: T[]): void => {
  if (!headerValues.length) {
    return;
  }

  const prevNCols = sheet.getMaxColumns();
  const nRows = sheet.getMaxRows();
  const prevLastCol = sheet.getRange(1, prevNCols, nRows, 1);

  // if the last col is empty, insert data in it
  if (
    !prevLastCol
      .getValues()
      .flat()
      .reduce((acc, cur) => acc || cur)
  ) {
    prevLastCol.getCell(1, 1).setValue(headerValues.pop());
  }

  if (headerValues.length) {
    // insert new columns and set it to the header value
    sheet
      .insertColumnsAfter(prevNCols, headerValues.length)
      .getRange(1, prevNCols + 1, 1, headerValues.length)
      .setValues(headerValues.map(column => [column]));

    // restore formulas in the new columns
    copyFormulas(sheet.getRange(2, prevNCols, nRows - 1, 1), sheet.getRange(2, prevNCols + 1, nRows - 1, headerValues.length));
  }
};

/** Copy formulas from `reference` to `target`. */
export const copyFormulas = (reference: Range, target: Range): void => {
  const targetValues = target.getValues();

  reference.copyTo(target, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);

  const formulas = target.getFormulas();

  target.clearContent().setValues(targetValues).setFormulas(formulas);
};
