import { Table, TableCell } from '@lib/models';

export const searchInTable = (table: Table, pattern: string): TableCell[] => {
  const cells: TableCell[] = [];
  const nRows = table.getNumRows();

  for (let i = 0; i < nRows; i++) {
    const row = table.getRow(i);
    const nCells = row.getNumCells();

    for (let j = 0; j < nCells; j++) {
      const cell = row.getCell(j);

      cell.findText(pattern) && cells.push(cell);
    }
  }

  return cells;
};
