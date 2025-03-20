import { FC, useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDB } from '../utilities/database_utils'
import { saveProjectAndUploadToS3 } from './store'

interface SaveCancelButtonProps {
    id: string
    value: string
    updateValue: (inputValue: string) => void
    doc_status: string
}

/**
 * A component that provides "Save" and "Cancel" buttons for managing project doc in DB.
 *
 * The component handles saving the project, showing a confirmation dialog for
 * canceling unsaved changes, and deleting an empty project if necessary.
 * It also manages the button states based on the document status and updates
 * the UI accordingly.
 *
 * @param id - The unique identifier for the project document.
 * @param updateValue - Function to update the document status.
 * @param doc_status - Current status of the document.
 * @returns The rendered component.
 */
const SaveCancelButton: FC<SaveCancelButtonProps> = ({
    id,
    value,
    updateValue,
    doc_status,
}) => {
    const navigate = useNavigate()
    const [disableSave, setDisableSave] = useState<boolean>(true)
    const [docStatus, setDocStatus] = useState<string>(doc_status)
    const [docName, setDocName] = useState<string>()
    const [buttonLabel, setButtonLabel] = useState<String>('Save Project')
    const db = useDB()

    const handleSaveButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        saveProject()
    }

    const handleCancelButtonClick = async (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        if (docStatus === 'created') {
            navigate('/', { replace: true })
            return
        }

        deleteEmptyProject()
    }

    const saveProject = async (projectDoc: any) => {
        try {
            const projectDoc: any = await db.get(id)

            if (!projectDoc || !validateFormCompletion(projectDoc)) {
                alert('Please complete all required fields before saving.')
                return
            }

            await saveProjectAndUploadToS3(projectDoc)

            updateValue('created')
            navigate('/', { replace: true })
        } catch (error) {
            console.error('Error saving project:', error)
        }
    }

    const handleSaveClick = async () => {
        const savedProject = localStorage.getItem("formData_prequalification");
    
        if (!savedProject) {
            console.error("No project data found in local storage.");
            return;
        }
    
        const projectDoc = JSON.parse(savedProject);
        await saveProjectAndUploadToS3(projectDoc);
    };

    const validateFormCompletion = (projectDoc: any) => {
        return (
            projectDoc.metadata_?.doc_name &&
            projectDoc.metadata_?.installer?.name &&
            projectDoc.metadata_?.installer?.company_name &&
            projectDoc.metadata_?.location?.street_address &&
            projectDoc.metadata_?.location?.city &&
            projectDoc.metadata_?.location?.state &&
            projectDoc.metadata_?.location?.zip_code
        )
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
                if (projectDoc && projectDoc.metadata_?.doc_name) {
                    setDisableSave(false)
                    if (!docName) setDocName(projectDoc.metadata_?.doc_name)
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
                <Button variant="secondary" onClick={handleCancelButtonClick}>
                    Cancel
                </Button>{' '}
                &nbsp;
                <Button
                    variant="primary"
                    onClick={handleSaveClick}
                    disabled={disableSave}
                >
                    {buttonLabel}
                </Button>
            </div>
        </center>
    )
}

export default SaveCancelButton
