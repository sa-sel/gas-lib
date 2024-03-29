import { GS } from '@lib/constants';
import { Range } from '@lib/models';

/** Copy formulas from `reference` to `target`. */
export const copyFormulas = (reference: Range, target: Range): void => {
  const targetValues = target.getValues();

  reference.copyTo(target, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);

  const formulas = target.getFormulas();

  target.clearContent().setValues(targetValues).setFormulas(formulas);
};

/** Copy format from `reference` to `target`. */
export const copyFormat = (reference: Range, target: Range): void => {
  const startRow = target.getRow();
  const endRow = startRow + target.getNumRows() - 1;
  const startCol = target.getColumn();
  const endCol = startCol + target.getNumColumns() - 1;

  reference.copyFormatToRange(reference.getSheet(), startCol, endCol, startRow, endRow);
};

/** Select the whole range directly below the received `header`. */
export const getRangeBelow = (header: Range | string): Range | null => {
  if (typeof header === 'string') {
    header = GS.ss.getRangeByName(header);
  }

  const sheet = header.getSheet();
  const firstRow = header.getLastRow() + 1;
  const firstCol = header.getColumn();
  const nCols = header.getNumColumns();
  const nRows = sheet.getMaxRows();

  return firstRow > nRows ? null : sheet.getRange(firstRow, firstCol, nRows - (firstRow - 1), nCols);
};

/** Check if two ranges overlap. */
export const rangesOverlap = (range1: Range, range2: Range): boolean => {
  if (range1.getSheet().getSheetId() !== range2.getSheet().getSheetId()) {
    return false;
  }

  const maxRow = Math.max(range1.getLastRow(), range2.getLastRow());
  const minRow = Math.min(range1.getRow(), range2.getRow());
  const maxCol = Math.max(range1.getLastColumn(), range2.getLastColumn());
  const minCol = Math.min(range1.getColumn(), range2.getColumn());

  const rowsOverlap = range1.getNumRows() + range2.getNumRows() > maxRow - minRow + 1;
  const colsOverlap = range1.getNumColumns() + range2.getNumColumns() > maxCol - minCol + 1;

  return rowsOverlap && colsOverlap;
};

/**
 * Set `values` to a `range`.
 * @param range target range
 * @param values matrix of values to be set. Any `undefined` value here will be substituted for that cell's previous formula or value.
 */
export const setValues = (range: Range, values: any[][]): void => {
  const nRows = range.getNumRows();
  const nCols = range.getNumColumns();

  if (!nRows || !nCols || values.length !== nRows) {
    throw new Error(
      'The `range` and `values` shapes do not match.\n'.concat(
        `range: ${nRows}x${nCols}\n`,
        `values: ${values.length}x${values[0].length}`,
      ),
    );
  }

  const prevFormulas = range.getFormulas();
  const prevValues = range.getValues();

  // substitute `undefined` values in `values`
  // for the cell's previous formula or value
  for (let i = 0; i < nRows; i++) {
    if (values[i].length !== nCols) {
      throw new Error(
        'The `range` and `values` shapes do not match.\n'.concat(
          `range: ${nRows}x${nCols}\n`,
          `values: ${values.length}x${values[i].length}`,
        ),
      );
    }

    for (let j = 0; j < nCols; j++) {
      if (values[i][j] === undefined) {
        values[i][j] = prevFormulas[i][j] || prevValues[i][j];
      }
    }
  }

  range.setValues(values);
};

/** Fetch a named range's value. */
export const getNamedValue = (name: string): string => GS.ss.getRangeByName(name).getValue();

/** Clear a range's content + uncheck checkboxes but keep formulas. */
export const safeClearContent = (range: Range): void => {
  const formulas = range.getFormulas();

  range.clearContent().uncheck().setFormulas(formulas);
};
