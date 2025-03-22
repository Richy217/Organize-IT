import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { removeFile} from './../files/filesSlice'

function ConfirmDeleteModal(props) {
    const dispatch = useDispatch();
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton closeVariant='white'>
        <Modal.Title id="contained-modal-title-vcenter">
          Löschen fortsetzen?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Sind Sie sich sicher, dass Sie die Tabelle und alle Änderungen daran löschen möchten?</p>
      </Modal.Body>
      <Modal.Footer>
      <Button variant='danger' onClick={() => { props.onHide(); dispatch(removeFile(props.index)); }}>Tabelle Löschen</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;

