import { DialogTitle, ss } from '@lib/constants';
import { SaveNewDataParams } from '@lib/models';
import { safeCall } from './function.util';
import { appendDataToSheet, clearSheet, readDataFromSheet } from './sheet.util';

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
  const allNewData: T[] = readDataFromSheet(newDataSheet, parseRowToData);
  const newDataSheetName = newDataSheet.getName();

  if (!allNewData.length) {
    ss.toast(`Nenhum dado foi encontrado na planilha "${newDataSheetName}".`, DialogTitle.Error);

    return;
  }

  const validate = safeCall(dataValidatorFactory, allNewData) ?? (() => true);

  // validate data
  allNewData.forEach(data => {
    (validate(data) ? validNewData : invalidNewData).push(data);
  });

  // append all valid data to the synced sheets
  if (validNewData.length) {
    ss.toast(`Os membros da planilha "${newDataSheetName}" estão sendo salvos.`, DialogTitle.InProgress);

    targetSheets.forEach(sheet => {
      appendDataToSheet(validNewData, sheet, obj => parseDataToRow(obj, sheet));
      safeCall(hooks?.afterAppend, sheet);
    });

    ss.toast(`Limpando os dados da planilha "${newDataSheetName}".`, DialogTitle.AlmostDone);
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
    ss.toast(
      invalidDataErrorMessage ?? `Há linhas com dados inválidos/ausentes na planilha "${newDataSheetName}".`,
      `${DialogTitle.Error} Dados inválidos.`,
    );
  } else {
    safeCall(hooks?.success);
    ss.toast('Os dados foram salvos.', DialogTitle.Success);
  }
};

/** Generate a random and (hopefully unique) 16-digit number. */
export const generateId = () => Math.round(new Date().valueOf() + Math.random() * 10e16);
