import React, { useState, useEffect } from 'react';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { deleteColumn, moveColumn, renameColumn } from './../files/filesSlice';
import { FaSortAlphaDown, FaPen, FaTrashAlt, FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';


const ActionModal = ({ show, headerName, closeModal, fileIndex }) => {
  const dispatch = useDispatch();
  const [selectedSortOption, setSelectedSortOption] = useState('asc');
  const [selectedHeaderOption, setSelectedHeaderOption] = useState(headerName);

  useEffect(() => {
    const storedSortOption = localStorage.getItem('selectedSortOption');
    if (storedSortOption) {
      setSelectedSortOption(storedSortOption);
    }
  }, []);

  const handleDeleteColumn = () => {
    const confirmed = window.confirm(`Are you sure you want to delete the column "${headerName}"?`);
    if (confirmed) {
      dispatch(deleteColumn({ fileIndex, headerName }));
      closeModal();
    }
  };

  const handleRenameColumn = () => {
    const inputPrompt = window.prompt('Enter the new header name:', headerName);
    if (inputPrompt !== null) {
      const newHeader = inputPrompt.trim();
      if (newHeader !== '') {
        dispatch(renameColumn({ fileIndex, oldHeaderName: headerName, newHeaderName: newHeader }));
      }
    }
    closeModal();
  };

  const handleSortOptionChange = (option) => {
    if (option === 'default') {
      setSelectedSortOption('standart');
      setSelectedHeaderOption(headerName);
      localStorage.setItem('selectedSortOption', 'standart');
      localStorage.setItem('setSelectedHeaderOption', headerName);
    } else {
      setSelectedSortOption(option);
      setSelectedHeaderOption(headerName);
      localStorage.setItem('selectedSortOption', option);
      localStorage.setItem('setSelectedHeaderOption', headerName);
    }
  };

  return (
    <Modal show={show} onHide={closeModal} size="sm" centered>
      <Modal.Header closeButton closeVariant='white'>
        <Modal.Title>Aktionen für {headerName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-grid gap-2">
          <Button variant="success" size="md" onClick={handleRenameColumn} block>
            <FaPen /> Umbenennen
          </Button>
          <Button variant="success" size="md" onClick={handleDeleteColumn} block>
            <FaTrashAlt /> Löschen
          </Button>
          <Button
            variant="success"
            size="md"
            onClick={() => dispatch(moveColumn({ fileIndex, headerName, direction: 'left' }))}
            block
          >
            <FaArrowAltCircleLeft /> Nach links verschieben
          </Button>
          <Button
            variant="success"
            size="md"
            onClick={() => dispatch(moveColumn({ fileIndex, headerName, direction: 'right' }))}
            block
          >
            <FaArrowAltCircleRight /> Nach rechts verschieben
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closeModal}>
          Schließen
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActionModal;
