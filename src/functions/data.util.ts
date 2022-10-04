import { DialogTitle, GS } from '@lib/constants';
import { FetchDataFunctions, Range, SaveNewDataParams, Sheet } from '@lib/models';
import { safeCall } from './function.util';
import { appendDataToSheet, clearSheet } from './sheet.util';

/** Save the data in the "new data" sheet to all target sheets. */
export const saveNewData = <T>({
  dataValidatorFactory,
  hooks,
  invalidDataErrorMessage,
  newDataSheet,
  parseDataToRow,
  parseRowToData,
  targetSheets,
}: SaveNewDataParams<T>) => {
  const validNewData: T[] = [];
  const invalidNewData: T[] = [];
  const allNewData: T[] = fetchData(newDataSheet, { map: parseRowToData });
  const newDataSheetName = newDataSheet.getName();

  if (!allNewData.length) {
    newDataSheet.activate();
    GS.ss.toast(`Nenhum dado foi encontrado na planilha "${newDataSheetName}".`, DialogTitle.Error);

    return;
  }

  // if no custom validation was provided, accept all data rows
  const validate = safeCall(dataValidatorFactory, allNewData) ?? (() => true);

  // validate data
  allNewData.forEach(data => {
    (validate(data) ? validNewData : invalidNewData).push(data);
  });

  // append all valid data to the synced sheets
  if (validNewData.length) {
    GS.ss.toast(`Os membros da planilha "${newDataSheetName}" estão sendo salvos.`, DialogTitle.InProgress);

    targetSheets.forEach(sheet => {
      appendDataToSheet(validNewData, sheet, obj => parseDataToRow(obj, sheet));
      safeCall(hooks?.afterAppend, sheet);
    });

    GS.ss.toast(`Limpando os dados da planilha "${newDataSheetName}".`, DialogTitle.AlmostDone);
    clearSheet(newDataSheet);
  }

  if (invalidNewData.length) {
    if (validNewData.length) {
      // re-write invalid new data to the `new data` table
      newDataSheet
        .getRange(newDataSheet.getFrozenRows() + 1, 1, invalidNewData.length, newDataSheet.getMaxColumns())
        .setValues(invalidNewData.map(obj => parseDataToRow(obj, newDataSheet)))
        .activate();
    }
    GS.ss.toast(
      invalidDataErrorMessage ?? `Há linhas com dados inválidos/ausentes na planilha "${newDataSheetName}".`,
      `${DialogTitle.Error} Dados inválidos.`,
    );
  } else {
    safeCall(hooks?.success);
    GS.ss.toast('Os dados foram salvos.', DialogTitle.Success);
  }
};

/** Run a function to manage the data in each of the target sheets. It's parameter must be the data's "id" cell. */
export const manageDataInSheets = (id: string, targetSheets: Sheet[], fn: (idCell: Range) => any): void =>
  targetSheets.forEach(sheet => {
    let occurrence: Range;
    const finder = sheet.createTextFinder(id);

    while ((occurrence = finder.findNext())) {
      fn(occurrence);
    }
  });

/**
 * Read all non-empty rows from `sheet` and convert them to a list of objects.
 * @param target sheet or range to append `data` to
 * @param functions methods to manage the rows and data
 * @param headers number of rows to be ignored when reading
 */
export const fetchData = <T>(
  target: Sheet | Range,
  functions?: FetchDataFunctions<T>,
  headers = (target as Sheet).getFrozenRows ? (target as Sheet).getFrozenRows() : 0,
): T[] => {
  if (target.getLastRow() <= headers) {
    return [];
  }

  let range: Range;

  if ((target as Sheet).getSheetId) {
    target = target as Sheet;
    range = target.getRange(1 + headers, 1, target.getLastRow() - headers, target.getMaxColumns());
  } else {
    target = target as Range;
    range = target.offset(headers, 0, target.getNumRows() - headers, target.getNumColumns());
  }

  return range.getValues().reduce((acc, cur) => {
    if (safeCall(functions?.filter, cur) ?? cur.some(cell => cell)) {
      acc.push(safeCall(functions?.map, cur) ?? cur);
    }

    return acc;
  }, []);
};
