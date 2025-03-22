import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import ActionModal from './../Modals/ActionModal';
import '../App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { noteCount, notesChecked, addNote, deleteNote, hasNotes, isFormChecked, checkAllNotes, uncheckAllNotes, toggleCheckNote, isNotEmpty, getBearbeitetKey } from '../functions/noteFunctions';
import { editTableCell, addRowToTable, addColumnToTable, getVisibleRowHeaderCount } from '../functions/tableFunctions';
import { NOTIZ, BEARBEITET } from './../files/specialColumns';

export function ReduxtoTable({ fileindex }) {
  const files = useSelector((state) => state.fileArray.files);
  const aktuellesfile = files[fileindex];
  const dispatch = useDispatch();

  const [sortHeader, setSortHeader] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [columnIndex, setColumnIndex] = useState(null);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [ setAscending] = useState(true); // Zustand für die Sortierreihenfolge

  useEffect(() => {
    // Sortieroption aus dem Local Storage abrufen
    const selectedSortOption = localStorage.getItem('selectedSortOption');
    const selectedHeaderOption = localStorage.getItem('selectedHeaderOption');
    if (selectedSortOption && selectedHeaderOption) {
      setSortHeader(selectedHeaderOption);
      // Überprüfen Sie die Sortierreihenfolge
      const selectedSortOrder = localStorage.getItem('selectedSortOrder');
      if (selectedSortOrder === 'desc') {
        setAscending(false);
      }
      if (selectedSortOrder === 'asc') {
        setAscending(true);
      }
    }
  }, []);

  useEffect(() => {
    const value = localStorage.getItem('scrollY');

    if (value === null) {
      localStorage.setItem('scrollY', 0);
    }
    const maxScrollY = document.body.scrollHeight - window.innerHeight;

    // window.scrollTo(0, parseInt(value * maxScrollY));
    window.scrollTo({ top: parseInt(value * maxScrollY), behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const normalizedScrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      localStorage.setItem('scrollY', normalizedScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener when the component unmounts
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array because we only need to set up the event listener once


  const handleHeaderClick = (header, index) => {
    console.log('Header geklickt:', header);
    setSortHeader(header);
    setColumnIndex(index);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleActionStart = (action) => {
    console.log('Ausgewählte Aktion:', action);
    closeModal();
  };

  const handleToggleNotes = (rowIndex) => {
    if (expandedRows.includes(rowIndex)) {
      setExpandedRows(expandedRows.filter((index) => index !== rowIndex));
    } else {
      setExpandedRows([...expandedRows, rowIndex]);
    }
  };


  // Sortierfunktion hinzugefügt
  const sortTable = () => {
    let sortedData = [...aktuellesfile.data];
    // sortedData.sort((a, b) => {
    //   const valueA = (a[sortHeader] || '').toString(); // Als Zeichenkette konvertieren und Standardwert auf leeren String setzen
    //   const valueB = (b[sortHeader] || '').toString(); // Als Zeichenkette konvertieren und Standardwert auf leeren String setzen
    //   if (ascending) {
    //     return valueA.localeCompare(valueB);
    //   } else {
    //     return valueB.localeCompare(valueA);
    //   }
    // });
    return sortedData;
  };

  // Sortieroption aus dem Local Storage abrufen
  const selectedSortOption = localStorage.getItem('selectedSortOption');
  const selectedHeader = localStorage.getItem('selectedHeaderOption');

  return (
    <div>
      <Table className="table" striped bordered hover>
        <thead>
          <tr className="table-header">
            <th>Notiz</th>
            <th>Bearbeitet</th>
            {Object.keys(aktuellesfile.data[0]).map((header, index) => (
              // Check if the header doesn't start with "Notiz-"
              !header.startsWith(NOTIZ) && !header.startsWith(BEARBEITET) ? (
                <th key={index} onClick={() => handleHeaderClick(header, index)}>
                  {header}
                  {selectedSortOption === header && (
                    <span> (Aktuell sortiert)</span>
                  )}
                </th>
              ) : null
            ))}
            <th>
              <Button variant="standard" onClick={() => setShowAddColumnModal(true)}>
                Neue Spalte
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortTable().map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {/* Regular row content */}
              <tr className="table-primary">
                <td>
                  <div style={{ display: 'flex' }}>
                    <Button
                      variant="standard"
                      onClick={() => handleToggleNotes(rowIndex)}
                      disabled={!hasNotes(row)} // Disable the button if no notes are present
                    >
                      Notiz
                    </Button>
                    <Button className="btn p-2 custom-button ml-2"
                      onClick={() => {
                        if (!expandedRows.includes(rowIndex)) {
                          setExpandedRows([...expandedRows, rowIndex]);
                        }
                        addNote(dispatch, fileindex, rowIndex, row);
                      }}>
                      <i className="bi bi-plus-circle"></i>
                    </Button>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Form.Check
                      type="checkbox"
                      checked={isFormChecked(row)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          checkAllNotes(dispatch, fileindex, rowIndex, row);
                        } else {
                          uncheckAllNotes(dispatch, fileindex, rowIndex, row);
                        }
                        // You can dispatch other actions here if needed
                      }}
                    />
                    <div style={{ marginLeft: 'auto' }}>{notesChecked(row)}/{noteCount(row)}</div>
                  </div>
                </td>
                {Object.keys(row).map((columnKey, columnIndex) => (
                  // Check if the columnKey doesn't start with "Notiz-"
                  !columnKey.startsWith(NOTIZ) && !columnKey.startsWith(BEARBEITET) ? (
                    <td
                      key={columnKey}
                      contentEditable="true"
                      onBlur={(e) =>
                        editTableCell(dispatch, fileindex, rowIndex, columnKey, e.target.textContent)
                      }
                    >
                      {row[columnKey]}
                    </td>
                  ) : null
                ))}
              </tr>

              {/* Notes row */}
              {expandedRows.includes(rowIndex) &&
                hasNotes(row) && // Render notes row only if there are notes
                Object.keys(row)
                  .filter((columnKey) => columnKey.startsWith(NOTIZ) && row[columnKey])
                  .map((notizKey) => (
                    <tr key={notizKey} className="table-notes">
                      <td colSpan={1}>
                        <div style={{ display: "flex", alignItems: "center" , flexGrow: 1}}>
                          {/* Checkbox and date code */}
                          <Form.Check
                            type="checkbox"
                            checked={isNotEmpty(row, getBearbeitetKey(notizKey))}
                            onChange={(e) => {
                              toggleCheckNote(dispatch, fileindex, rowIndex, notizKey, e.target.checked)
                            }}
                          />
                          <span style={{ marginLeft: "10px" }}>{row[getBearbeitetKey(notizKey)]}</span>
                        </div>
                      </td>
                      <td colSpan={getVisibleRowHeaderCount(row) +1}>
                        <div style={{ display: "flex", justifyContent: "space-between"}}>
                          <div
                            style={{ flexGrow: 1, wordWrap: 'break-word', overflowWrap: 'anywhere'}} // Add this style to make the text field as wide as the container
                            contentEditable="true"
                            onBlur={(e) => {
                              if (e.target.textContent !== "") {
                                editTableCell(dispatch, fileindex, rowIndex, notizKey, e.target.textContent);
                              }
                              else {
                                editTableCell(dispatch, fileindex, rowIndex, notizKey, " ");
                              }
                            }}
                          >
                            {row[notizKey]}
                          </div>
                          <Button className="btn p-2 custom-button ml-2" onClick={() => deleteNote(dispatch, fileindex, rowIndex, row, notizKey)}>
                            <i class="bi bi-x-circle" style={{ color: 'salmon' }} ></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      <ActionModal
        show={showModal}
        headerName={sortHeader}
        closeModal={closeModal}
        handleActionStart={handleActionStart}
        fileIndex={fileindex}
        columnIndex={columnIndex}
      />

      <div style={{ textAlign: 'center' }}>
        <Button variant="standard" onClick={() => addRowToTable(dispatch, fileindex)}>
          Neue Zeile
        </Button>
        {/* Hier wird Space eingefügt damit der Button nicht überdeckt wird */}
        <div style={{ height: '6rem' }}></div>
      </div>

      <Modal show={showAddColumnModal} onHide={() => setShowAddColumnModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Neue Spalte hinzufügen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Spaltenname:</Form.Label>
            <Form.Control
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowAddColumnModal(false)}>
            Abbrechen
          </Button>
          <Button variant="standard" onClick={() => {
            addColumnToTable(dispatch, fileindex, newColumnName);
            setShowAddColumnModal(false);
            setNewColumnName('');
          }}>
            Spalte hinzufügen
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
