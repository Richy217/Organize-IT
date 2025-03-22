import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaSortAlphaDown, FaPen, FaTrashAlt, FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';

export function ModalComponent({
  selectedHeader,
  handleModalClose,
  handleModalConfirm,
  handleRenameColumn,
  handleDeleteColumn,
  handleMoveColumn
}) {
  const handleRenameClick = () => {
    const newHeader = prompt('Neuer Spaltenname');
    if (newHeader && newHeader.trim() !== '') {
      handleRenameColumn(selectedHeader, newHeader);
      handleModalClose();
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Möchten Sie die Spalte "${selectedHeader}" wirklich löschen?`)) {
      handleDeleteColumn(selectedHeader);
      handleModalClose();
    }
  };

  const handleMoveLeftClick = () => {
    handleMoveColumn(selectedHeader, 'left');
    handleModalClose();
  };

  const handleMoveRightClick = () => {
    handleMoveColumn(selectedHeader, 'right');
    handleModalClose();
  };

  return (
    <Modal show={true} onHide={handleModalClose} centered>
      <Modal.Header closeButton closeVariant='white'>
        <Modal.Title>Ausgewählt: {selectedHeader}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-grid gap-2">
          <Button variant="success" size="lg" onClick={() => handleModalConfirm('Sortieren')} block>
            <FaSortAlphaDown /> Sortieren
          </Button>
          <Button variant="success" size="lg" onClick={handleRenameClick} block>
            <FaPen /> Umbenennen
          </Button>
          <Button variant="success" size="lg" onClick={handleDeleteClick} block>
            <FaTrashAlt /> Löschen
          </Button>
          <Button variant="success" size="lg" onClick={handleMoveLeftClick} block>
            <FaArrowAltCircleLeft /> Nach links verschieben
          </Button>
          <Button variant="success" size="lg" onClick={handleMoveRightClick} block>
            <FaArrowAltCircleRight /> Nach rechts verschieben
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
