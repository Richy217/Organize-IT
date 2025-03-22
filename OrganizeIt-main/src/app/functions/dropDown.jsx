import React, { useContext, useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { FileContext } from './../../contexts/filescontext';

function DropdownExcelFile(props) {
  const { importedFiles } = useContext(FileContext);
  const { setter } = props;
  const [activeTable, setActiveTable] = useState('');

  useEffect(() => {
    // Beim Laden der Komponente den gespeicherten Tab-Namen aus dem localStorage holen
    const storedTab = localStorage.getItem('activeTab');
    setActiveTable(storedTab);
  }, []);

  const onClick = (key, name) => {
    localStorage.setItem('activeTab', key);
    setter(key);
    setActiveTable(name);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {activeTable ? activeTable : 'Tabellen bearbeiten'}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ position: 'relative' }}>
        {importedFiles.map((file, index) => (
          <Dropdown.Item key={index} href={`#/action-${index + 1}`} onClick={() => onClick(file.name, file.name)} >
            {file.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownExcelFile;
