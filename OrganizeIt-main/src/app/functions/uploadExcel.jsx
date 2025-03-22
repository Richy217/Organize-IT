import React from 'react';
// import { FileContext } from './../../contexts/filescontext';
import * as XLSX from 'xlsx';
import { useDispatch } from 'react-redux'
import { addFile} from './../files/filesSlice'
import { useSelector } from 'react-redux';

function ExcelFileUploader(props) {

  //Redux dispatcher initializieren
  const dispatch = useDispatch()

  //Über State Files aus dem Store holen
  const storeFiles = useSelector((state) => state.fileArray.files);

  // const { importedFiles } = useContext(FileContext);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    const url = URL.createObjectURL(file);
  
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
  
    xhr.onload = function (e) {
      const buffer = new Uint8Array(xhr.response);
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
      let fileName = file.name.slice(0, file.name.lastIndexOf('.'));
      let count = 1;
      
      //Die Erkennung eines Filenamens ist noch an den Context gebunden -> sollte noch geändert werden
      // -> 11.09.23 habe ich geändert, falls Kontext nochmal gebraucht wird hier storeFiles zu importedFiles ändern

      const updateFileName = (name) => {
        if (storeFiles.some((importedFile) => importedFile.name === name) || props.getter.some((importedFile) => importedFile.name === name)) {
          return updateFileName(`${file.name.slice(0, file.name.lastIndexOf('.'))}_${count++}`);
        }
        return name;
      };
  
      fileName = updateFileName(fileName);
  
      const updatedFile = {
        name: fileName,
        data: excelData,
      };
      
      //speichert das updated file im redux store
      dispatch(addFile(updatedFile))
      props.setter((prevFiles) => [...prevFiles, updatedFile]);
      localStorage.setItem('activeTab', fileName);
    };
    
    xhr.send();
  };

  
  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".xlsx,.xls,.csv,.ods" />
      <p>Aktuelle ausgewählte Excel-Dateien:</p>
      <ul>
        {props.getter.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ExcelFileUploader;
