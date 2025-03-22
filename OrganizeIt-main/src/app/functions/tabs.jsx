import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSelector } from 'react-redux';
import { ReduxtoTable } from './ReduxtoTable';
import Importmodal from './../Modals/importmodal';

// Farbe aus dem CSS holen
const root = document.documentElement;
const primaryColor = getComputedStyle(root).getPropertyValue('--table-primary-color');  

function ControlledTabsExample(props) {
  const files = useSelector(state => state.fileArray.files); // Zugriff auf das Array von Excel-Dateien im State
  const tabNameCounts = {};
  const { getter, setter } = props;

  // Zustand, um den Hinweis anzuzeigen, wenn die Tabelle leer ist
  const [isTableEmpty, setTableEmpty] = useState(files.length === 0);

  useEffect(() => {
    // Beim Laden der Komponente den gespeicherten aktiven Tab aus dem Local Storage wiederherstellen
    const storedActiveTab = localStorage.getItem('activeTab');
    setter(storedActiveTab);

    // Zustand für den Hinweis aktualisieren, falls die Tabelle leer ist
    setTableEmpty(files.length === 0);
  }, [files, setter]);

  const getTabName = (file) => {
    const baseName = file.name;
    const count = tabNameCounts[baseName] || 0;
    tabNameCounts[baseName] = count + 1;
    return count === 0 ? baseName : `${baseName} ${count}`;
  };

  const handleTabSelect = (key) => {
    setter(key);
    // Den aktiven Tab im Local Storage speichern
    localStorage.setItem('activeTab', key);
  };

  return (
    <>
      {isTableEmpty ? ( // Hinweis anzeigen, wenn die Tabelle leer ist
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
          <h5 style={{ marginBottom: '1rem', marginTop: '-10rem' }}>Hier können Sie ihr erste Tabellen Datei hochladen.</h5>
          <Importmodal/>
        </div>
      ) : ( // Wenn die Tabelle nicht leer ist, die Tabs wie zuvor anzeigen
        <Tabs id="controlled-tab-example" className="mb-3" activeKey={getter} onSelect={handleTabSelect} >
          {files.map((file, index) => {
            const tabName = getTabName(file);
            const fileindextab = index;

            return (
              <Tab key={index} eventKey={tabName} title={tabName} style={{ backgroundColor: primaryColor }}>
                {getter === tabName && (
                  <div className='table-responsive'>
                    <ReduxtoTable fileindex={fileindextab} />
                  </div>
                )}
              </Tab>
            );
          })}
        </Tabs>
      )}
    </>
  );
}

export default ControlledTabsExample;
