import React from 'react'
import { Modal, Button } from 'react-bootstrap'

export default function NewProjectPopup() {
    return (
        <Modal show={true}>
            <Modal.Header closeButton>
                <Modal.Title>New Project Autofill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Would you like to autofill the New Project form with one of the
                following data sets?
                <div>Data set 1</div>
                <div>Data set 2</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary">Skip</Button>
                <Button variant="danger">Autofill with chosen data</Button>
            </Modal.Footer>
        </Modal>
    )
}
