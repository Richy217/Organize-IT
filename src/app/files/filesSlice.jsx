import { createSlice } from '@reduxjs/toolkit';
import { SPECIALCOLUMNS } from './specialColumns';

export const filesSlice = createSlice({
  name: 'filedata',
  initialState: {
    files: [] // Array von Excel-Dateien im initialState
  },
  reducers: {
    // Weitere Reducer-Funktionen hier, falls benötigt

    addFile: (state, action) => {
      state.files.push(action.payload); // Füge eine Excel-Datei zum Array hinzu
    },
    removeFile: (state, action) => {
      const index = action.payload;
      state.files.splice(index, 1); // Entferne eine Excel-Datei aus dem Array
    },
    editTabledata: (state, action) => {
      const { fileIndex, rowIndex, columnIndex, value } = action.payload;
      if (state.files[fileIndex]) {
        state.files[fileIndex].data[rowIndex][columnIndex] = value; // Speichere den Wert in der gewünschten Zelle
      }
    },

    moveColumn: (state, action) => {
      const { fileIndex, headerName, direction } = action.payload;

      const data = state.files[fileIndex].data;
      const headers = Object.keys(data[0]);
      const columnIndex = headers.indexOf(headerName);

      if (columnIndex === -1) {
        console.error('Header name not found in the data.');
        return;
      }

      const newIndex =
        direction === 'left' ? columnIndex - 1 : direction === 'right' ? columnIndex + 1 : columnIndex;

      if (newIndex < 0 || newIndex >= headers.length || columnIndex === newIndex) return;


      const newHeaders = data.map((row) => {
        const newRow = { ...row };
        const headerToMove = headers[columnIndex];
        const keys = Object.keys(newRow);
        keys.splice(columnIndex, 1); // Remove the moved column from its original position
        keys.splice(newIndex, 0, headerToMove); // Insert the moved column at the new position
        const newOrderedRow = {};
        keys.forEach((key) => {
          newOrderedRow[key] = newRow[key];
        });
        return newOrderedRow;
      });

      state.files[fileIndex].data = newHeaders;
    },

    //sss

    deleteColumn: (state, action) => {
      const { fileIndex, headerName } = action.payload;

      const data = state.files[fileIndex].data;
      const headers = Object.keys(data[0]);
      const columnIndex = headers.indexOf(headerName);

      if (columnIndex === -1) {
        console.error('Header name not found in the data.');
        return;
      }

      const newHeaders = data.map((row) => {
        const newRow = { ...row };
        delete newRow[headerName]; // Remove the column with the given header name
        return newRow;
      });

      state.files[fileIndex].data = newHeaders;
    },

    renameColumn: (state, action) => {
      const { fileIndex, oldHeaderName, newHeaderName } = action.payload;

      const data = state.files[fileIndex].data;
      const headers = Object.keys(data[0]);
      const columnIndex = headers.indexOf(oldHeaderName);

      if (columnIndex === -1) {
        console.error('Header name not found in the data.');
        return;
      }

      const newHeaders = data.map((row) => {
        const newRow = { ...row };
        newRow[newHeaderName] = newRow[oldHeaderName]; // Rename the column
        delete newRow[oldHeaderName]; // Remove the old header
        return newRow;
      });

      state.files[fileIndex].data = newHeaders;
    },
    addRow: (state, action) => {
      const { fileIndex, newRowData } = action.payload;
      if (state.files[fileIndex]) {
        const headers = Object.keys(state.files[fileIndex].data[0]);
        const emptyRow = {};
        headers.forEach(header => {
          emptyRow[header] = newRowData[header] || ''; // Setze den Wert auf einen leeren String, falls das Header-Feld nicht in newRowData enthalten ist
        });
        state.files[fileIndex].data.push(emptyRow);
      }
    },
    addColumn: (state, action) => {
      const { fileIndex, newColumnName } = action.payload;
      if (state.files[fileIndex]) {
        state.files[fileIndex].data = state.files[fileIndex].data.map(row => {
          const newRow = {};
          let specialColumnFound = false;

          for (const key in row) { // SPECIALCOLUMNS enthält die Namen der Spalten, die immer Rechts von der neuen Spalte sein sollen wie z.B. "Notiz-1"
            if (!specialColumnFound && SPECIALCOLUMNS.some(column => key.startsWith(column))) {
              newRow[newColumnName] = '';
              specialColumnFound = true;
            }
            newRow[key] = row[key];
          }

          
          if (!specialColumnFound) {
            newRow[newColumnName] = '';
          }

          return newRow;
        });
      }
    }
  }
});

export const { addFile, removeFile, editTabledata, moveColumn, deleteColumn, renameColumn, addRow , addColumn} = filesSlice.actions;

export default filesSlice.reducer;