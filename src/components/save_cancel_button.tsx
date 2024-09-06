import { FC, useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import PouchDB from 'pouchdb'
import dbName from './db_details'

interface SaveCancelButtonProps {
    id: string
    label: string
    updateValue: (inputValue: string) => void
    value: string
    doc_status: string
}

const SaveCancelButton: FC<SaveCancelButtonProps> = ({
    id,
    label,
    updateValue,
    value,
    doc_status,
}) => {
    const navigate = useNavigate()
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false)
    const [disableSave, setDisableSave] = useState<boolean>(true)
    const [docStatus, setDocStatus] = useState<string>(doc_status)
    const [docName, setDocName] = useState<string>()
    const db = new PouchDB(dbName)

    const handleSaveButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        saveProject()
    }

    const handleCancelButtonClick = async (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        if (docStatus === 'created') {
            setShowCancelConfirmation(false)
            navigate('/', { replace: true })
        } else if (disableSave) {
            setShowCancelConfirmation(false)
            deleteEmptyProject()
        } else setShowCancelConfirmation(true)
    }

    const saveProject = () => {
        updateValue('created')
        navigate('/', { replace: true })
        setShowCancelConfirmation(false)
    }

    const cancelAction = () => {
        setShowCancelConfirmation(false)
    }

    useEffect(() => {
        checkProjectDocName()
        db.changes({
            since: 'now',
            live: true,
        }).on('change', checkProjectDocName)
    }, [])

    const checkProjectDocName = async () => {
        try {
            if (docStatus !== 'deleted') {
                const projectDoc: any = await db.get(id)
                if (projectDoc && projectDoc.data_?.doc_name) {
                    setDisableSave(false)
                    if (!docName) setDocName(projectDoc.data_?.doc_name)
                }
            }
        } catch (error) {}
    }

    const deleteEmptyProject = async () => {
        try {
            if (docStatus === 'new') {
                const projectDoc: any = await db.get(id)
                if (projectDoc) {
                    db.remove(projectDoc)
                    setDocStatus('deleted')
                }
            }
        } catch (error) {
            console.error('Error in discarding the empty project:', error)
        } finally {
            navigate('/', { replace: true })
        }
    }

    return (
        <center>
            <div>
                <Button onClick={handleCancelButtonClick}>Cancel</Button> &nbsp;
                <Button onClick={handleSaveButtonClick} disabled={disableSave}>
                    Save
                </Button>
                <Modal show={showCancelConfirmation} onHide={cancelAction}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you do not want to <b>Save</b> the project?
                        Data entered will be lost.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={saveProject}>Save</Button>
                        <Button onClick={deleteEmptyProject}>Discard</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </center>
    )
}

export default SaveCancelButton
