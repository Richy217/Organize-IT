import { editTabledata, addRow, addColumn } from '../files/filesSlice';
import { SPECIALCOLUMNS } from '../files/specialColumns';

export function editTableCell(dispatch, fileIndex, rowIndex, columnIndex, newTableData) {
    dispatch(
        editTabledata({
            fileIndex: fileIndex,
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            value: newTableData
        })
    );
};

export function addRowToTable(dispatch, fileIndex) {
    dispatch(
        addRow({
            fileIndex: fileIndex,
            newRowData: {}
        })
    );
};

export function addColumnToTable(dispatch, fileIndex, newColumnName) {
    dispatch(
        addColumn({
            fileIndex: fileIndex,
            newColumnName: newColumnName,
        })
    );
};

export function getVisibleRowHeaderCount(row) {
    return Object.keys(row).filter(
        key => !SPECIALCOLUMNS.some(column => key.startsWith(column))
    ).length;
}