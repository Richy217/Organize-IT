import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { removeFile} from './../../files/filesSlice'
import ConfirmDeleteModal from './../Modals/deleteModal';

function ExportExcel() {
    const files = useSelector(state => state.fileArray.files);
    const [selectedFiles, setSelectedFiles] = useState([]);
    // const dispatch = useDispatch();
    const [modalShow, setModalShow] = React.useState(false);

    const toggleFileSelection = (index) => {
        if (selectedFiles.includes(index)) {
          setSelectedFiles(selectedFiles.filter((selectedIndex) => selectedIndex !== index));
        } else {
          setSelectedFiles([...selectedFiles, index]);
          console.log(selectedFiles);
        }
      };

    const exportExcelFile = (index) => {    
    
    const data = files[index].data
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, files[index].name + '.xlsx');
    }

    return(
        <div className="d-grid gap-2">
          <Form>
            <ListGroup as="ol">
            {files.map((file, index) => (
              <ListGroup.Item as="li" key={index} style={{ marginRight: "1.5rem",marginLeft:"1.5rem"}}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Form.Check
                      type="checkbox"
                      label={file.name}
                      checked={selectedFiles.includes(index)}
                      onChange={() => toggleFileSelection(index)}
                    />
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash3"
                      // onClick={() => dispatch(removeFile(index))}
                      onClick={() => setModalShow(true)}
                      style={{ cursor: "pointer", marginBottom: "2px"}}
                    >
                      <path
                        d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"
                      />
                    </svg>
                  </div>
                  <ConfirmDeleteModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  index = {React.key}
                  />
                </div>
              </ListGroup.Item>
              ))}
          </ListGroup>
        </Form>

        <Button variant="success" className="export" onClick={() => selectedFiles.forEach(exportExcelFile)}>
          Export
        </Button>
        </div>
    );
}

export default ExportExcel;
