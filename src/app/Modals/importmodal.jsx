import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, { useState, useContext } from 'react';
import ExcelFileUploader from './../functions/uploadExcel';
import { FileContext } from './../contexts/filescontext';

function MyVerticallyCenteredModal(props) {
  const [tempArray, setTempArray] = useState([])
  const { setImportedFiles } = useContext(FileContext);
  const {setter} = props
  
  const onClose= (e) => {
    setTempArray([]);
    props.onHide();
  }
  const onClickImport = (e) => {
    setImportedFiles((prevFiles) => [...prevFiles, ...tempArray]);
    if (tempArray.length !== 0) {
      let lastObject = tempArray[tempArray.length - 1].name
      localStorage.setItem('activeTab', lastObject);
      setter(lastObject);
      
    }
    onClose(e);
  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onClose}
    >
      <Modal.Header closeButton closeVariant='white'>
        <Modal.Title id="contained-modal-title-vcenter">
          Import Optionen
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Datei(en) hochladen</h4>
        <ExcelFileUploader setter={setTempArray} getter={tempArray}  />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClickImport}>Importieren</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Importmodal(props) {
  const [modalShow, setModalShow] = React.useState(false);

  return (

    <div className="d-grid gap-2">
        <Button variant="success" className="import" onClick={() => setModalShow(true)}>
          Import
        </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        setter = {props.setter}
      />
    </div>
  );
}

export default Importmodal;