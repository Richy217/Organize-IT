import React, { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useSelector } from 'react-redux';
import { ReduxtoTable } from './ReduxtoCards';
// import Importmodal from './../Home/importmodal';

function ControlledTabsExample(props, searchTerm) {
  const files = useSelector(state => state.fileArray.files); // Access the array of Excel files in the state
  const tabNameCounts = {};
  const { getter, setter } = props;

  // State to display the hint when the table is empty
  const [isTableEmpty, setTableEmpty] = useState(files.length === 0);

  useEffect(() => {
    // Restore the stored active tab from Local Storage when the component loads
    const storedActiveTab = localStorage.getItem('activeTab');
    setter(storedActiveTab);

    // Update the hint state if the table is empty
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
    // Save the active tab to Local Storage
    localStorage.setItem('activeTab', key);
  };

  return (
    <div className="gray-background" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isTableEmpty ? ( // Display hint when the table is empty

        // Hier könnte man noch das Importmodal einfügen sieht aber mit dem Hintergrund scheiße aus
        // <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        //   <h5 style={{ marginBottom: '1rem', marginTop: '-5rem' }}>Hier können Sie ihr erste Tabellen Datei hochladen.</h5>
        //   <Importmodal/>
        // </div>
         <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <h5>In the top right menu, you can import and manage your files.</h5>
        </div>
      ) : (
        // If the table is not empty, display the Tabs as before
        <Tabs id="controlled-tab-example" className="mb-3" activeKey={getter} onSelect={handleTabSelect}>
          {files.map((file, index) => {
            const tabName = getTabName(file);
            const fileindextab = index;

            return (
              <Tab key={index} eventKey={tabName}>
                {getter === tabName && (
                  <div className='table-responsive'>
                    <ReduxtoTable fileindex={fileindextab} search={props.searchTerm} />
                  </div>
                )}
              </Tab>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

export default ControlledTabsExample;
