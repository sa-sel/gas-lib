import { ss } from '@lib/constants';
import { Range } from '@lib/models';

/** Copy formulas from `reference` to `target`. */
export const copyFormulas = (reference: Range, target: Range): void => {
  const targetValues = target.getValues();

  reference.copyTo(target, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);

  const formulas = target.getFormulas();

  target.clearContent().setValues(targetValues).setFormulas(formulas);
};

/** Select the whole range directly below the received `header`. */
export const getRangeBelow = (header: Range | string): Range | null => {
  if (typeof header === 'string') {
    header = ss.getRangeByName(header);
  }

  const sheet = header.getSheet();
  const firstRow = header.getLastRow() + 1;
  const firstCol = header.getColumn();
  const nCols = header.getNumColumns();
  const nRows = sheet.getMaxRows();

  return firstRow >= nRows ? null : sheet.getRange(firstRow, firstCol, nRows - (firstRow - 1), nCols);
};

export const rangesOverlap = (range1: Range, range2: Range): boolean => {
  const maxRow = Math.max(range1.getLastRow(), range2.getLastRow());
  const minRow = Math.min(range1.getRow(), range2.getRow());
  const maxCol = Math.max(range1.getLastColumn(), range2.getLastColumn());
  const minCol = Math.min(range1.getColumn(), range2.getColumn());

  const rowsOverlap = range1.getNumRows() + range2.getNumRows() > maxRow - minRow;
  const colsOverlap = range1.getNumColumns() + range2.getNumColumns() > maxCol - minCol;

  return rowsOverlap && colsOverlap;
};
