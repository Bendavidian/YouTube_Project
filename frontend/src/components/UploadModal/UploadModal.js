import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Upload from '../../pages/Upload/Upload';
import './UploadModal.css';

const UploadModal = () => {
  const [show, setShow] = useState(false); // State for modal visibility
  const handleClose = () => setShow(false); // Function to close modal
  const handleShow = () => setShow(true); // Function to show modal

  return (
    <>
      <button variant="primary" onClick={handleShow}>
       <i className="bi bi-plus-square"></i>
      </button>
      <Modal show={show} size="xl" onHide={handleClose} style={{backgroundImage: "url(/movie_center.png)"}}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontWeight:"bold", fontSize: "30px"}}>Upload Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Upload onHide={handleClose}/>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UploadModal;
