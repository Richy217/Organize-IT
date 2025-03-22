import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Form } from 'react-bootstrap';
import { noteCount, notesChecked, allNotesChecked, addNote, deleteNote, hasNotes, isFormChecked, isFinished, getLatestDate, checkAllNotes, toggleCheckNote, isNotEmpty, getBearbeitetKey} from './noteFunctions';
import { editTableCell } from './tableFunctions';
import { NOTIZ, BEARBEITET } from '../files/specialColumns';


export function ReduxtoTable({ fileindex, search }) {
  const files = useSelector((state) => state.fileArray.files);
  const aktuellesfile = files[fileindex];
  const dispatch = useDispatch();

  //const [editedValues, setEditedValues] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const value = localStorage.getItem('scrollY');
  
    if (value === null) {
      localStorage.setItem('scrollY', 0);
    }
    const maxScrollY = document.body.scrollHeight - window.innerHeight;

    //window.scrollTo(0, parseInt(value * maxScrollY));
    window.scrollTo({ top: parseInt(value * maxScrollY), behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const normalizedScrollY  = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      localStorage.setItem('scrollY', normalizedScrollY);
    };

    window.addEventListener('scroll', handleScroll);
     // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // 

  
  const generateHeaderKeys = (data) => { // Wählt das Objekt mit den meisten Keys aus
    let maxHeaderCount = 0;
    let headerKeys;

    data.forEach(row => {
      const headerCount = Object.keys(row).length;
      if (headerCount > maxHeaderCount) {
        maxHeaderCount = headerCount;
        headerKeys = Object.keys(row);
      }
    });

    return headerKeys;
  };

  const headerKeys = generateHeaderKeys(aktuellesfile.data);

  const handleExpandRow = (rowIndex) => {
    setExpandedRow(rowIndex === expandedRow ? null : rowIndex);
  };



  if (aktuellesfile && aktuellesfile.data) {
    const filteredRows = aktuellesfile.data
      .filter(row => Object.values(row).some(value => value.toString().includes(search)));

    return (
      <div style={{ marginLeft: '50px', marginRight: '50px', marginTop: '100px', marginBottom: '200px' }}>
        <div className="card-container">
          {filteredRows.map((filteredRow, filteredRowIndex) => {
            const originalRowIndex = aktuellesfile.data.findIndex(originalRow => originalRow === filteredRow);

            return (
              <div key={originalRowIndex}>
                <Card className="data-card" style={{ marginBottom: '20px', flex: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)', border: '1px solid #21ad6c', backgroundColor: '#2C3645' }}>
                  <Card.Body>
                    <div onClick={() => handleExpandRow(originalRowIndex)}>

                      <div style={{ display: 'flex' }}>
                        {isFormChecked(filteredRow) && (
                          <div style={{ fontSize: '12px', color: 'gray' }}>
                            <span style={{ marginRight: '5px' }}>Bearbeitet</span>
                            <span>{getLatestDate(filteredRow)}</span>
                          </div>
                        )}
                        <div style={{ marginLeft: 'auto' }}>
                          {hasNotes(filteredRow)
                            ? <span style={{ color: allNotesChecked(filteredRow) ? '#21ad6c' : 'white' }}>
                                {`${notesChecked(filteredRow)}/${noteCount(filteredRow)}`}
                              </span> 
                            : <span style={{ color: 'transparent' }}>I</span>
                          }
                        </div>
                      </div>
                      {expandedRow === originalRowIndex ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginBottom: '8px',
                            marginTop: '8px',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleExpandRow(originalRowIndex)}
                        >
                          <div
                            style={{
                              backgroundColor: 'transparent',
                              padding: '8px',
                              borderRadius: '4px',
                              color: 'white',
                              border: '1px solid white'
                            }}
                          >
                            Schließen
                          </div>
                        </div>
                      ) : ( // First three headers are used for the title, if available
 
                        <div >
                          {filteredRow[headerKeys[0]]}
                          {filteredRow[headerKeys[1]] !== undefined && filteredRow[headerKeys[1]] !== "" ? <><span style={{ paddingLeft: '10px', paddingRight: '10px' }}>|</span>{filteredRow[headerKeys[1]]}</> : null}
                          {filteredRow[headerKeys[2]] !== undefined && filteredRow[headerKeys[2]] !== "" ? <><span style={{ paddingLeft: '10px', paddingRight: '10px' }}>|</span>{filteredRow[headerKeys[2]]}</> : null}
                        </div>

                      )}
                    </div>
                    {expandedRow === originalRowIndex && (
                      <>
                        {headerKeys.map((headerKey, columnIndex) => {
                          if (!headerKey.startsWith(NOTIZ) && !headerKey.startsWith(BEARBEITET)) {
                            return (
                              <div key={headerKey}>
                                <p><strong>{headerKey}</strong></p>
                                <td
                                  key={headerKey}
                                  contentEditable="true"
                                  onBlur={(e) => /*handleEdit(originalRowIndex, headerKey, e.target.textContent)*/ editTableCell(dispatch, fileindex, originalRowIndex, headerKey, e.target.textContent)}
                                  style={{ display: 'flex' }}
                                  colSpan={1}
                                >

                                  <div style={{ flexGrow: 1 , minHeight: '1.5rem'}}>
                                    
                                    {filteredRow[headerKey]}
                                  </div>
                                </td>
                                {columnIndex < headerKeys.length - 1 && (
                                  <hr style={{ margin: '5px 0' }} />
                                )}
                              </div>
                            );
                          } else if (headerKey.startsWith(NOTIZ) && isNotEmpty(filteredRow, headerKey)) {
                            return (
                              <div key={headerKey}>
                                <p><strong>{headerKey}</strong></p>
                                <div style={{ display: 'flex', alignItems: 'center', overflow: 'auto', wordWrap: 'break-word', overflowWrap: 'anywhere'}}>
                                  {filteredRow[headerKey] !== "" ? (
                                    <td>
                                      <Form.Check
                                        type="checkbox"
                                        style={{ marginRight: '10px' }}
                                        checked={isNotEmpty(filteredRow, getBearbeitetKey(headerKey)) }
                                        onChange={(e) => { toggleCheckNote(dispatch, fileindex, originalRowIndex, headerKey, e.target.checked) }}
                                      />
                                    </td>
                                  ) : null}
                                  <td
                                    key={headerKey}
                                    contentEditable="true"
                                    onBlur={(e) => {
                                      if (e.target.textContent !== "") {
                                        editTableCell(dispatch, fileindex, originalRowIndex, headerKey, e.target.textContent);
                                      }
                                      else {
                                        editTableCell(dispatch, fileindex, originalRowIndex, headerKey, " ");
                                      }
                                    }}
                                    style={{ flexGrow: 1, overflow: 'auto', wordWrap: 'break-word', overflowWrap: 'anywhere'}}
                                  >
                                    {filteredRow[headerKey]}
                                  </td>
                                  <Button className="btn p-2 custom-button ml-2" onClick={() => deleteNote(dispatch, fileindex, originalRowIndex, filteredRow, headerKey)}>
                                    <i class="bi bi-x-circle" style={{ color: 'salmon' }} ></i>
                                  </Button>
                                </div>
                                {columnIndex < headerKeys.length - 1 && (
                                  <hr style={{ margin: '5px 0' }} />
                                )}
                              </div>
                            );

                          }
                          return null; // Return null for items you want to skip
                        })}

                        <div style={{ marginTop: '50px', marginBottom: '30px', textAlign: 'center' }}>
                          <Button
                            variant="primary"
                            style={{ marginLeft: '30px', marginRight: '30px', marginTop: '30px', marginBottom: '30px' }}
                            onClick={() =>  addNote(dispatch, fileindex, originalRowIndex, filteredRow)}
                          >
                            Notiz +
                          </Button>
                          <Button
                            variant="success"
                            style={{ marginLeft: '30px', marginRight: '30px', marginTop: '30px', marginBottom: '30px' }}
                            onClick={() => checkAllNotes(dispatch, fileindex, originalRowIndex, filteredRow)}
                            disabled={isFinished(filteredRow)}
                          >
                            Bearbeitet
                          </Button>
                        </div>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <p>No data available.</p>;
  }
}
